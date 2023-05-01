# Admin Commands

https://affiliate.best-brokers-partners.com/api/trpc-playground

![img.png](img.png)

## Execute any query on the database

```js
await trpc.misc.runAdminCommand.mutate({
  cmd: "prisma-query",
  data: "SELECT id,mail from affiliates",
  secret: "eEZJPfeWIzfXZG7Kgf11TXBOxmDyh8+r8VaPh8LTiUM="
})
```

![img_1.png](img_1.png)
