'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    imageUrl: DataTypes.STRING
  }, {});
  Post.associate = function(models) {
    Post.belongsTo(models.User);
  };
  return Post;
};
