const router = require("express").Router();
const {
  models: { User, Cart, CartItem },
} = require("../db");
const Product = require("../db/models/Products");
const { requireToken, isAdmin } = require("./gateKeepingMiddleware");
module.exports = router;

//Before I even enter this route, I'm going to make sure that I'm logged in first.
router.get("/", requireToken, isAdmin, async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and username fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ["id", "username", "securityLevel", "email"],
      include: Cart,
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", requireToken, isAdmin, async (req, res, next) => {
  try {
    let user = await User.findAll({
      where: { id: req.params.id },
      attributes: ["id", "username", "email", "securityLevel"],
      include: [{ model: Cart }],
    });
    res.send(user[0]);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", requireToken, isAdmin, (req, res, next) => {
  User.destroy({
    where: { id: req.params.id },
  })
    .then(() => res.sendStatus(204))
    .catch(next);
});

//@chase this route is not working properly.  As you fix it make sure to destructure the req.body to protect against injection.
router.put("/edit/:id", requireToken, isAdmin, (req, res, next) => {
  try {
    User.update(req.body, {
      where: { id: req.params.id },
    })
      .then(() => res.sendStatus(204))
      .catch(next);
  } catch (err) {
    next(err);
  }
});
