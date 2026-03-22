module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['step_definitions/**/*.ts'],
    paths: ['features/**/*.feature'],
  },
};
