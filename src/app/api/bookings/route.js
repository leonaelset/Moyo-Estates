// app/api/bookings/route.js
export async function POST(req) {
  const AIRTABLE_API_TOKEN = process.env.AIRTABLE_API_TOKEN;
  const BASE_ID = process.env.AIRTABLE_BASE_ID;
  const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;

  console.log("POST /api/bookings called");

  if (!AIRTABLE_API_TOKEN || !BASE_ID || !TABLE_NAME) {
    console.error("Missing Airtable environment variables");
    return new Response(
      JSON.stringify({ error: "Server configuration error" }),
      { status: 500 }
    );
  }

  try {
    const data = await req.json();
    console.log("Booking data received:", data);

    // Validate that data is an object
    if (typeof data !== "object" || data === null) {
      console.error("Invalid booking data format:", data);
      return new Response(
        JSON.stringify({ error: "Invalid booking data format" }),
        { status: 400 }
      );
    }

    // Prepare payload for Airtable
    const payload = { fields: {} };

    // Only include keys with valid string/number/boolean values
    for (const key in data) {
      const value = data[key];
      if (
        value !== undefined &&
        value !== null &&
        (typeof value === "string" || typeof value === "number" || typeof value === "boolean")
      ) {
        payload.fields[key] = value;
      }
    }

    const response = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    console.log("Airtable response:", result);

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: "Airtable request failed", details: result }),
        { status: response.status }
      );
    }

    return new Response(
      JSON.stringify({ success: true, record: result }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error saving to Airtable:", err);
    return new Response(
      JSON.stringify({ error: "Server error", details: err.message }),
      { status: 500 }
    );
  }
}
