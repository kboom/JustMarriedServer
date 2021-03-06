import jwtManager from "../../main/security/jwt/jwt.manager";

function getTokenFor(account) {
  return jwtManager.releaseToken(account).token;
}

export { getTokenFor };
