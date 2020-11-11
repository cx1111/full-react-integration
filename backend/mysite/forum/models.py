from django.db import models


class Post(models.Model):
    identifier = models.URLField(max_length=300, unique=True)
    title = models.CharField(max_length=300)
    author = models.ForeignKey('user.User', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    num_comments = models.PositiveIntegerField(default=0)
    topics = models.ManyToManyField(to='forum.Topic', related_name='posts')

    def __str__(self):
        return f'{self.title} - {self.identifier}'

    def add_topic(self, name: str):
        """
        Add a topic to this comment
        """
        topic = Topic.objects.filter(name=name)

        if topic:
            topic = topic.get()
        else:
            topic = Topic.objects.create(name=name)

        self.topics.add(topic)
        # TODO: Proper increment
        topic.count += 1
        topic.save()


class Topic(models.Model):
    MAX_CHAR_LENGTH = 50

    # TODO: name regex validator
    name = models.CharField(max_length=MAX_CHAR_LENGTH, unique=True)
    count = models.PositiveIntegerField(default=0)

    followed_users = models.ManyToManyField(
        'user.User', related_name='followed_topics')

    def __str__(self):
        return f'{self.name} - {self.count} count'


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
