import * as Cookie from 'js-cookie';

const TEST_MODE = process.env.REACT_APP_TEST_MODE || Cookie.get('TEST_MODE') == 'true' || false;
if (TEST_MODE) {
  console.log("Running in Test Mode")
}
export default TEST_MODE;
