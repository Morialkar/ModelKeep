export async function getUnauthenticated() {
  const unauthenticatedValues = {
    testFlag: true,
  };
  return { statusCode: 200, body: JSON.stringify(unauthenticatedValues) };
}
