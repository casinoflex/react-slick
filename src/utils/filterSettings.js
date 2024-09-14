import defaultProps from "../constants/default-props";

export default function filterSettings(settings) {
  const validSettings = Object.keys(defaultProps);

  return validSettings.reduce((acc, settingName) => {
    if (settings.hasOwnProperty(settingName)) {
      acc[settingName] = settings[settingName];
    }
    return acc;
  }, {});
}
