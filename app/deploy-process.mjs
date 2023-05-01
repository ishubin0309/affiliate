#!/usr/bin/env zx

const { _, step, service, prod: deployProd } = argv;

const sites = [
  {
    name: "freevpnplanet",
    LEGACY_PHP_URL: "affiliate.freevpnplanet.com",
    prod: {
      domain: "go.freevpnplanet.com",
      TXT: "google-site-verification=SdFxnRU5WfBxM63I1Do4sRztOPOu7T3TgkfCdCLQyG8",
    },
    dev: {
      TXT: "google-site-verification=ao3QP3TLFk6kg_tTuHEC8poESgK4cOpJkEujEMSiPVs",
    },
  },
  {
    name: "bi-winning",
    LEGACY_PHP_URL: "partners.bi-winning.org",
    prod: {},
    dev: {
      TXT: "google-site-verification=gHbtaFsW6cjA1BDSgUTysmEYP2BViiduU5RiyC7A2fs",
    },
  },
  {
    name: "fivestars-market",
    LEGACY_PHP_URL: "partners.fivestars-markets.com",
    dev: {
      TXT: "google-site-verification=ySNJ6xA4irl1Wjfv_B5fSdejwoQGk2lVOccKnOQfN1o",
    },
  },
  {
    name: "focusoption",
    LEGACY_PHP_URL: "partners.focusoption.com",
    dev: {
      TXT: "google-site-verification=dQrcg_qZ9DlT_RHnwckPqBKtu3hmpvc1ZIzQBeY-8aQ",
    },
  },
];

console.log(`muly:STEP`, { _, step, service });

let out = "";

for (const site of sites) {
  if (service && site.service !== service) {
    continue;
  }

  const { domain, name, dev = {}, prod, LEGACY_PHP_URL } = site;
  if (deployProd) {
    prod.service = `${name}-prod`;
  }
  if (!deployProd) {
    dev.service = `${name}-dev`;
    dev.domain = `${name}.staging.affiliatets.com`;
  }

  const val = deployProd ? prod : dev;
  let txt = "";

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
Add the TXT record below to the DNS configuration for ${val.domain}.
${val.TXT}

`);
  }
}

if (out) {
  const fileName = "./tmp/deploy-process.txt";
  await fs.writeFile(fileName, out);
  console.log(`Written to ${fileName}`);
}
