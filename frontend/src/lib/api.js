const API_URL = "http://localhost:4000"; // your backend server

export async function signup(data) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Signup failed:", errorText);
    throw new Error(`Signup failed: ${errorText}`);
  }
  return res.json();
}

export async function signin(data) {
  const res = await fetch(`${API_URL}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
