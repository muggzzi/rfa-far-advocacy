export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") {
      return new Response("Only POST requests are allowed", { status: 405 });
    }

    const targetUrl = "https://script.google.com/macros/s/AKfycbwJ0epu01xeKBOVdnCziCxrSDxfu-gveh9xalZeaNscSEH7PjMVuFWBXnb9Sn097eIV/exec";

    const body = await request.text();

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    const responseBody = await response.text();

    return new Response(responseBody, {
      status: response.status,
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*",
      },
    });
  },
};
Add Cloudflare Worker script

