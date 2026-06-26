const token = "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjY2OTg3Mjk3NywiYWFpIjoxMSwidWlkIjoxMDUzMzE3NTQsImlhZCI6IjIwMjYtMDYtMTFUMTQ6MTQ6NDYuNzE0WiIsInBlciI6Im1lOndyaXRlIiwiYWN0aWQiOjM1NTYwODA0LCJyZ24iOiJ1c2UxIn0.3CaOSCcuQg60iYfocIt3ggG0_Ch6CnI9KDWu0ThT6aI";

async function run() {
  const query = `
    query {
      boards {
        id
        name
      }
      boards_2: boards(ids: [18417366949]) {
        name
        columns {
          id
          title
          type
        }
      }
    }
  `;
  
  const res = await fetch("https://api.monday.com/v2", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
      'API-Version': '2023-10'
    },
    body: JSON.stringify({ query })
  });
  
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

run();
