#!/usr/bin/env zx

// ./deploy-process.mjs --step=secret
// ./deploy-process.mjs --step=verify --prod
// ./deploy-process.mjs --step=verify --prod --service=fxoro
// ./deploy-process.mjs --step=create --prod --service=fxoro
// ./deploy-process.mjs --step=secret --prod --service=fxoro
// ./deploy-process.mjs --step=dns
// ./deploy-process.mjs --step=secret --prod
// ./deploy-process.mjs --step=secret

import { sites } from "./deploy.secrets.mjs";

const { _, step, service, prod: deployProd } = argv;

console.log(`muly:STEP`, { _, step, service });

let out = "";

async function updateGcpSecret(secretName, secretValue) {
  try {
    // Check if the secret exists
    await $`gcloud secrets describe ${secretName}`;
  } catch (error) {
    // If the secret does not exist, create it
    await $`gcloud secrets create ${secretName} --replication-policy="automatic"`;
  }

  // Create a temporary file
  const tmpDir = os.tmpdir();
  const tmpFile = path.join(tmpDir, `gcp_secret_${secretName}_tmp.txt`);

  // Write the secret value to the temporary file
  await fs.writeFile(tmpFile, secretValue, "utf8");

  // Add a new version to the secret or update the existing secret
  await $`gcloud secrets versions add ${secretName} --data-file=${tmpFile}`;

  // Remove the temporary file
  await fs.unlink(tmpFile);

  console.log(
    `New version of secret "${secretName}" added with value: "${secretValue}"`
  );
}

for (const site of sites) {
  if (service && site.name !== service) {
    continue;
  }

  const {
    domain,
    name,
    dev = {},
    prod,
    LEGACY_PHP_URL,
    user,
    password,
    db,
  } = site;

  if (deployProd) {
    if (!prod) {
      continue;
    }
    prod.service = `${name}-prod`;
  }
  if (!deployProd) {
    dev.service = `${name}-dev`;
    dev.domain = `${name}.staging.affiliatets.com`;
  }
  const databaseUrl = `mysql://${user}:${password}@35.204.215.28:3306/${db}`;
  const secretName = `${
    deployProd ? "PROD" : "DEV"
  }_${name.toUpperCase()}_DATABASE_URL`;

  const val = deployProd ? prod : dev;
  let txt = "";

  if (step === "secret-list") {
    await $`gcloud secrets describe ${secretName}`;
  }
  if (step === "secret") {
    console.log(`Create secret ${secretName}`);
    await updateGcpSecret(secretName, databaseUrl);
  }

  if (step === "create") {
    if (deployProd) {
      txt = `
      - id: "deploy_${name}"
        name: deploy ${name}
        uses: "google-github-actions/deploy-cloudrun@v1"
        with:
          service: "${name}-prod"
          image: "europe-docker.pkg.dev/api-front-dashbord/production/aff:latest"
          labels: env=prod
          project_id: api-front-dashbord
          region: europe-west1
          secrets: |
            DATABASE_URL=PROD_${name.toUpperCase()}_DATABASE_URL:latest
            LEGACY_PHP_ACCESS_TOKEN=PROD_LEGACY_PHP_ACCESS_TOKEN:latest
            NEXTAUTH_SECRET=PROD_NEXTAUTH_SECRET:latest
            SENDGRID_API_KEY=SENDGRID_API_KEY:latest
          env_vars: |
            LEGACY_PHP_URL=${LEGACY_PHP_URL}
            NEXTAUTH_URL=https://${prod.domain}
            NODE_ENV=production
          flags: |
            --allow-unauthenticated
            --vpc-connector=production-serverless-vp
            --vpc-egress=all-traffic
            --port=3000
            --max-instances=5
            --min-instances=0

    `;
    } else {
      txt = `
      - id: "deploy_${name}"
        name: deploy ${name}-staging
        uses: "google-github-actions/deploy-cloudrun@v1"
        with:
          service: "${name}-staging"
          image: "europe-docker.pkg.dev/api-front-dashbord/dev/aff:latest"
          labels: env=dev
          project_id: api-front-dashbord
          region: europe-west1
          secrets: |
            DATABASE_URL=DEV_${name.toUpperCase()}_DATABASE_URL:latest
            LEGACY_PHP_ACCESS_TOKEN=DEV_LEGACY_PHP_ACCESS_TOKEN:latest
            NEXTAUTH_SECRET=DEV_NEXTAUTH_SECRET:latest
            SENDGRID_API_KEY=SENDGRID_API_KEY:latest
          env_vars: |
            LEGACY_PHP_URL=${LEGACY_PHP_URL}
            NEXTAUTH_URL=https://${dev.domain}
            NODE_ENV=production
          flags: |
            --allow-unauthenticated
            --vpc-connector=development-serverless-vp
            --vpc-egress=all-traffic
            --port=3000
            --max-instances=3
            --min-instances=0

    `;
    }

    console.log(txt);
    out += txt;
  }

  if (step === "verify") {
    console.log(
      `Will open GCP page, select namecheap and verify, copy TXT to deploy.secrets.mjs`
    );
    await $`gcloud domains verify ${val.domain}`;
    // console.log(
    //   `not working need to do it manually. see docs/deploy/new-customer-deploy.md ##Verify domain"
    //
    //   service: ${val.service}
    //   domain: ${val.domain}
    //
    //   `
    // );
  }

  if (step === "dns") {
    console.log(`DOMAIN: ${val.domain}
TXT: ${val.TXT}
CNAME: ghs.googlehosted.com
`);
  }
}

if (out) {
  const fileName = "./tmp/deploy-process.txt";
  await fs.writeFile(fileName, out);
  console.log(`Written to ${fileName}`);
}
