export const storageConfig = {
  isProd: process.env.NODE_ENV === 'production',
  wasabi: {
    endpoint: `https://s3.${process.env.WASABI_REGION}.wasabisys.com`,
    region: process.env.WASABI_REGION!,
    bucket: process.env.WASABI_BUCKET!
  },
  localPath: 'uploads'
}