module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['step_definitions/world.ts', 'step_definitions/registerVehicle.steps.ts', 'step_definitions/parkVehicle.steps.ts'],
    paths: ['features/**/*.feature'],
  },
  postgres: {
    requireModule: ['ts-node/register'],
    require: ['step_definitions/world.postgres.ts', 'step_definitions/registerVehicle.steps.ts', 'step_definitions/parkVehicle.steps.ts'],
    paths: ['features/**/*.feature'],
  },
};
