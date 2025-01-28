export async function GET(req) {
  const headers = req.headers;
  
  return Response.json({
    userId: headers.get('x-user-id') || 'No ID',
    userName: headers.get('x-user-name') || 'No Name',
    userRole: headers.get('x-user-role') || 'No Role',
  });
}
