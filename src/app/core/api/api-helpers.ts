export default class ApiHelpers {
  constructor() {}

  handleQueryError(responseJson: any) {
    // console.log(responseJson);

    if (responseJson.error || responseJson.errors) {
      throw new Error(responseJson.errors[0].message);
    }
  }
}
