from django.db import models


class Post(models.Model):
    identifier = models.URLField(max_length=300, unique=True)
    title = models.CharField(max_length=300)
    author = models.ForeignKey('user.User', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    num_comments = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f'{self.title} - {self.identifier}'


class Comment(models.Model):
    content = models.TextField(max_length=1000)
    is_reply = models.BooleanField()
    parent_comment = models.ForeignKey(
        'forum.Comment', blank=True, null=True, on_delete=models.CASCADE, related_name='replies')
    num_replies = models.PositiveIntegerField(default=0)
    post = models.ForeignKey(
        'forum.Post', on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(
        'user.User', on_delete=models.CASCADE, related_name='comments')
    created_at = models.DateTimeField(auto_now_add=True)
    edited_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f'{self.content[:20]}'


class Vote(models.Model):
    # 0 = up, 1 = down
    vote_type = models.PositiveSmallIntegerField()
    comment = models.ForeignKey(
        'forum.Comment', null=True, on_delete=models.CASCADE)
    author = models.ForeignKey('user.User', on_delete=models.CASCADE)

    class Meta:
        unique_together = [['comment', 'author']]
