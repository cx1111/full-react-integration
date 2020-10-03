from django.db import models


class Post(models.Model):
    # The url
    identifier = models.URLField(max_length=300)
    title = models.CharField(max_length=300)
    author = models.ForeignKey('user.User', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)


class Comment(models.Model):
    content = models.TextField(max_length=1000)
    # The comment that this one is a reply to, if any
    reply_comment = models.ForeignKey('forum.Comment', null=True, on_delete=models.CASCADE)
    post = models.ForeignKey('forum.Post', on_delete=models.CASCADE)
    author = models.ForeignKey('user.User', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    edited_at = models.DateTimeField(null=True)


class Vote(models.Model):
    # 0 = up, 1 = down
    vote_type = models.PositiveSmallIntegerField()
    comment = models.ForeignKey('forum.Comment', null=True, on_delete=models.CASCADE)
    author = models.ForeignKey('user.User', on_delete=models.CASCADE)


    class Meta:
        unique_together = [['comment', 'author']]
