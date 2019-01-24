const getProfile = (req,res,db) => {
  const { id } = req.params;
  db.select('*').from('users').where('id',id)
    .then(user => {
      if (user.length) {
        res.json(user);
      }
      else {
        res.json('Unable to find the user!')
      }
    })
    .catch(err => res.status(400).json('Unknown error happened when getting the profile!'));
}

module.exports = {
  getProfile:getProfile
}
