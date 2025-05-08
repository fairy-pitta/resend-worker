export default {
    async fetch(request, env) {
      const url = new URL(request.url)
  
      // CORS Preflight対応
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        })
      }
  
      // POST以外は拒否
      if (request.method !== "POST") {
        return new Response("Method Not Allowed", {
          status: 405,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        })
      }
  
      const body = await request.json()
  
      // Contact Form
      if (url.pathname === "/api/contact") {
        const { name, email, message } = body
  
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "contact@singbirds.net",
            to: "shunaruna@gmail.com",
            subject: `New contact form submission from ${name}`,
            html: `
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Message:</strong><br/>${message}</p>
            `,
          }),
        })
  
        return new Response(JSON.stringify({ success: res.ok }), {
          status: res.ok ? 200 : 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        })
      }
  
      // Newsletter Form
      if (url.pathname === "/api/newsletter") {
        const { email } = body
  
        if (!email) {
          return new Response(JSON.stringify({ success: false, error: "No email provided" }), {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          })
        }
  
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "newsletter@singbirds.net",
            to: "shunaruna@gmail.com",
            subject: "New Newsletter Subscriber",
            html: `<p><strong>New subscriber email:</strong> ${email}</p>`,
          }),
        })
  
        return new Response(JSON.stringify({ success: res.ok }), {
          status: res.ok ? 200 : 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        })
      }
  
      // それ以外のパスは404
      return new Response("Not Found", {
        status: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      })
    },
  }