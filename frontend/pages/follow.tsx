import React from "react";
import { omit } from "lodash";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { Button, Container, Typography } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
// import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Layout from "components/Layout";
import { forumAPI, ListTopicsResponse } from "lib/endpoints/forum";
import { useFetch } from "hooks/useFetch";
import { parseError } from "lib/endpoints/error";
import { AuthContext } from "context/AuthContext";
import { ProtectedRoute } from "components/RouteAuth";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    topicsList: {
      marginTop: theme.spacing(2),
      width: "100%",
      backgroundColor: theme.palette.background.paper,
      //   border: "1px solid",
    },
  })
);

const Follow: React.FC = ({}) => {
  const classes = useStyles();
  const { accessToken, isAuthenticated } = React.useContext(AuthContext);

  // Displayed topics
  const [
    { data: topicsData, error: topicsError, loading: topicsLoading },
    {
      setData: setTopicsData,
      setError: setTopicsError,
      setLoading: setTopicsLoading,
    },
  ] = useFetch<ListTopicsResponse>({ loading: true });

  // const [
  //   { data: followedTopicsData, loading: followedTopicsLoading },
  //   {
  //     setData: setFollowedTopicsData,
  //     setError: setFollowedTopicsError,
  //     setLoading: setFollowedTopicsLoading,
  //   },
  // ] = useFetch<Record<string, boolean>>({ loading: true });

  // Topics followed by the user
  const [followedTopics, setFollowedTopics] = React.useReducer(
    (
      topics: Record<number, boolean>,
      update: {
        // Either the full object, or a key to set to true
        item: number | Record<number, boolean>;
        action: "add" | "remove";
      }
    ): Record<number, boolean> => {
      if (typeof update.item !== "number") {
        return update.item;
      }
      if (update.action === "add") {
        return { ...topics, [update.item]: true };
      }
      return omit(topics, update.item);
    },
    {}
  );

  const loadTopics = React.useCallback(async () => {
    if (!accessToken) {
      return;
    }
    try {
      setTopicsLoading(true);
      const response = await forumAPI.listTopics();
      setTopicsData(response.data);
    } catch (e) {
      const errorInfo = parseError<null>(e);
      if (errorInfo) {
        setTopicsError(errorInfo.detail);
      }
      setTopicsData(undefined);
      setTopicsLoading(false);
    }

    // Load followed topics
    try {
      // setFollowedTopicsLoading(true);
      const response = await forumAPI.listFollowedTopics(accessToken);
      const followed = response.data.reduce(function (map, topic) {
        map[topic.id] = true;
        return map;
      }, {} as Record<number, boolean>);
      setFollowedTopics({ item: followed, action: "add" });
    } catch (e) {
      const errorInfo = parseError<null>(e);
      if (errorInfo) {
        setTopicsError(errorInfo.detail);
      }
      setTopicsData(undefined);
    } finally {
      setTopicsLoading(false);
    }
  }, [setTopicsData, setTopicsLoading, setTopicsError, accessToken]);

  React.useEffect(() => {
    loadTopics();
  }, [loadTopics, isAuthenticated]);

  const handleFollowTopic = (topicId: number) => {
    if (!accessToken) {
      return;
    }
    try {
      forumAPI.followTopic(topicId, accessToken);
      setFollowedTopics({ item: topicId, action: "add" });
    } catch (e) {}
  };

  const handleUnfollowTopic = (topicId: number) => {
    if (!accessToken) {
      return;
    }
    try {
      forumAPI.unfollowTopic(topicId, accessToken);
      setFollowedTopics({ item: topicId, action: "remove" });
    } catch (e) {}
  };

  return (
    <ProtectedRoute>
      <Layout>
        <Container maxWidth="sm">
          <div>
            <Typography component={"h1"} variant={"h2"}>
              Follow Topics
            </Typography>
          </div>
          {topicsLoading && <Typography>Loading...</Typography>}
          {topicsError && (
            <Typography>Error loading topics: {topicsError}</Typography>
          )}
          {topicsData && (
            <div className={classes.topicsList}>
              <List component="nav" aria-label="topics">
                {topicsData.map((topic) => (
                  <>
                    <ListItem>
                      <ListItemText primary={topic.name} />
                      {followedTopics[topic.id] ? (
                        <Button
                          variant="outlined"
                          size="small"
                          aria-label="unfollow"
                          onClick={() => handleUnfollowTopic(topic.id)}
                        >
                          Unfollow
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          aria-label="follow"
                          onClick={() => handleFollowTopic(topic.id)}
                        >
                          Follow
                        </Button>
                      )}
                    </ListItem>
                    <Divider />
                  </>
                ))}
              </List>
            </div>
          )}
        </Container>
      </Layout>
    </ProtectedRoute>
  );
};

export default Follow;
