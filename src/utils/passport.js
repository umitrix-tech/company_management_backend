const passport = require("passport");
const prisma = require("../../prisma");
const bcrypt = require("bcryptjs");
const { USER_BACKEND_STATUS } = require("./constData");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // callbackURL: "/api/auth/google/callback",
       callbackURL: "https://api.umitrix.in/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {

        console.log(profile,'profile');
        
        const email = profile.emails?.[0]?.value;

        let user = await prisma.user.findUnique({
          where: { email }
        });

            const password = await bcrypt.hash(`${email}@123`, 10);
        

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              name: profile.displayName,
              empCode:Date.now().toString(),
              backEndStatus:USER_BACKEND_STATUS.only_login,
              // photo: profile.photos?.[0]?.value || "",
              password: password, // OAuth users no password
            }
          });
        }

        done(null, user);

      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;