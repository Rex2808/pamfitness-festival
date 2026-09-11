import { withSupabase } from "npm:@supabase/server@^1";

export default {
  fetch: withSupabase(
    { auth: "user" },
    async (req, ctx) => {
      if (req.method !== "POST") {
        return Response.json(
          { error: "Method not allowed." },
          { status: 405 }
        );
      }

      try {
        const { supabaseAdmin } = ctx;
        const userId =
          ctx.userClaims?.id ?? ctx.userClaims?.sub;

        if (!userId) {
          return Response.json(
            {
              error:
                "Authenticated user identity not found.",
            },
            { status: 401 }
          );
        }

        const body = await req.json();

        const {
          email,
          role,
          festival_id,
        } = body;

        if (
          typeof email !== "string" ||
          !email.trim() ||
          typeof role !== "string" ||
          !["FESTIVAL_ADMIN", "STAFF"].includes(role) ||
          typeof festival_id !== "string" ||
          !festival_id.trim()
        ) {
          return Response.json(
            {
              error:
                "email, role, and festival_id are required. Role must be FESTIVAL_ADMIN or STAFF.",
            },
            { status: 400 }
          );
        }

        const normalizedEmail =
          email.trim().toLowerCase();

        if (
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            normalizedEmail
          )
        ) {
          return Response.json(
            {
              error:
                "A valid email address is required.",
            },
            { status: 400 }
          );
        }

        const {
          data: festival,
          error: festivalError,
        } = await supabaseAdmin
          .from("festivals")
          .select("id, name, is_active")
          .eq("id", festival_id)
          .single();

        if (festivalError || !festival) {
          return Response.json(
            { error: "Festival not found." },
            { status: 404 }
          );
        }

        if (!festival.is_active) {
          return Response.json(
            { error: "Festival is not active." },
            { status: 400 }
          );
        }

        const {
          data: adminProfile,
          error: adminError,
        } = await supabaseAdmin
          .from("admin_users")
          .select("id, role, festival_id")
          .eq("user_id", userId)
          .single();

        if (adminError || !adminProfile) {
          return Response.json(
            { error: "Admin access required." },
            { status: 403 }
          );
        }

        if (adminProfile.role !== "PLATFORM_ADMIN") {
          return Response.json(
            {
              error:
                "Only platform administrators can invite admins.",
            },
            { status: 403 }
          );
        }

const { data: invitedUser, error: inviteError } =
  await supabaseAdmin.auth.admin.inviteUserByEmail(
    normalizedEmail,
    {
      redirectTo:
        "https://pamfitness-festival.netlify.app/admin/setup",
    }
  );

if (inviteError || !invitedUser.user) {
  console.error(
    "Error inviting user:",
    inviteError
  );

  return Response.json(
    {
      error:
        inviteError?.message ||
        "Unable to send invitation.",
    },
    { status: 400 }
  );
}

const { error: assignmentError } =
  await supabaseAdmin
    .from("admin_users")
    .insert({
      user_id: invitedUser.user.id,
      role,
      festival_id,
    });

if (assignmentError) {
  console.error(
    "Error creating admin assignment:",
    assignmentError
  );

  await supabaseAdmin.auth.admin.deleteUser(
    invitedUser.user.id
  );

  return Response.json(
    {
      error:
        "Invitation could not be completed because the admin assignment failed.",
    },
    { status: 500 }
  );
}

return Response.json({
  success: true,
  message: `Invitation sent to ${normalizedEmail}.`,
  admin: {
    email: normalizedEmail,
    role,
    festival_id,
    festival_name: festival.name,
  },
});
      } catch (error) {
        console.error(
          "invite-admin error:",
          error
        );

        return Response.json(
          { error: "Internal server error." },
          { status: 500 }
        );
      }
    }
  ),
};