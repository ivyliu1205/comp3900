// Only the values within the 'config' block are changeable during testing
// START config
const assumeLogined = false;
const assumeUseCreatorRecipeDetails = false;

const useStateChangeLogger = false;
const enforceStrictStateChange = false;
// END config



const devConfigIsDebug = process.env.NODE_ENV !== 'production';
const devConfigAssumesLogined = devConfigIsDebug && assumeLogined;
const devConfigUseCreatorRecipeDetails = devConfigAssumesLogined && assumeUseCreatorRecipeDetails;
const devConfigUseStateChangeLogger = devConfigIsDebug && useStateChangeLogger;
const devConfigEnforceStrictStateChange = devConfigIsDebug && enforceStrictStateChange;

export default {devConfigIsDebug, devConfigAssumesLogined, devConfigUseCreatorRecipeDetails, devConfigUseStateChangeLogger, devConfigEnforceStrictStateChange}
export {devConfigIsDebug, devConfigAssumesLogined, devConfigUseCreatorRecipeDetails, devConfigUseStateChangeLogger, devConfigEnforceStrictStateChange}