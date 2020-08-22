SELECT "places_place"."id",
       "places_place"."name",
       COUNT("history_history"."id") FILTER (WHERE "history_history"."typus" = 13)                                                         AS "activity_done_count",
       COUNT("history_history"."id") FILTER (WHERE ("history_history"."activity_id" IN (SELECT U0."id"
                                                                                        FROM "activities_activity" U0
                                                                                                 INNER JOIN "places_place" U1 ON (U0."place_id" = U1."id")
                                                                                                 INNER JOIN "groups_group" U2 ON (U1."group_id" = U2."id")
                                                                                                 LEFT OUTER JOIN "activities_activity_participants" U3 ON (U0."id" = U3."activity_id")
                                                                                        WHERE (U0."is_disabled" = false AND
                                                                                               lower(U0."date") < '2020-08-21T17:40:56.756315+00:00'::timestamptz AND
                                                                                               U3."user_id" IS NULL)) AND
                                                    "history_history"."typus" = 15))                                                       AS "activity_leave_count",
       COUNT("history_history"."id") FILTER (WHERE "history_history"."id" IN (SELECT V0."id"
                                                                              FROM "history_history" V0
                                                                              WHERE (CASE
                                                                                         WHEN (V0."typus" = 15) THEN (
                                                                                             ROUND(
                                                                                                         EXTRACT(
                                                                                                                 EPOCH
                                                                                                                 FROM (
                                                                                                                     "history_history"."payload" #>> ARRAY ['date','0']
                                                                                                                     ) :: timestamp with time zone
                                                                                                             )
                                                                                                         -
                                                                                                         EXTRACT(EPOCH FROM "history_history"."date")
                                                                                                 )
                                                                                             )
                                                                                         ELSE NULL END <= 86400 AND
                                                                                     V0."typus" = 15 AND
                                                                                     V0."activity_id" IN (SELECT U0."id"
                                                                                                          FROM "activities_activity" U0
                                                                                                                   INNER JOIN "places_place" U1 ON (U0."place_id" = U1."id")
                                                                                                                   INNER JOIN "groups_group" U2 ON (U1."group_id" = U2."id")
                                                                                                                   LEFT OUTER JOIN "activities_activity_participants" U3 ON (U0."id" = U3."activity_id")
                                                                                                          WHERE (U0."is_disabled" = false AND
                                                                                                                 lower(U0."date") < '2020-08-21T17:40:56.758086+00:00'::timestamptz AND
                                                                                                                 U3."user_id" IS NULL))))) AS "activity_leave_late_count",
       COALESCE((SELECT SUM(U0."weight") AS "total_weight"
                 FROM "activities_feedback" U0
                 WHERE U0."about_id" = "history_history"."activity_id"
                 GROUP BY U0."id"),
                0)                                                                                                                         AS "activity_feedback_weight"
FROM "places_place"
         INNER JOIN "groups_group" ON ("places_place"."group_id" = "groups_group"."id")
         LEFT OUTER JOIN "history_history" ON ("places_place"."id" = "history_history"."place_id")
         LEFT OUTER JOIN "activities_activity" ON ("history_history"."activity_id" = "activities_activity"."id")
         INNER JOIN "groups_group_members" ON ("groups_group"."id" = "groups_group_members"."group_id")
         INNER JOIN "history_history" T7 ON ("places_place"."id" = T7."place_id")
         INNER JOIN "activities_activity" T8 ON (T7."activity_id" = T8."id")
WHERE ("places_place"."group_id" = 1 AND
       lower("activities_activity"."date") <= '2020-08-21T17:40:56.701000+00:00'::timestamptz AND
       "groups_group_members"."user_id" = 18 AND "places_place"."group_id" = 1 AND
       lower(T8."date") <= '2020-08-21T17:40:56.701000+00:00'::timestamptz)
GROUP BY "places_place"."id",
         COALESCE((SELECT SUM(U0."weight") AS "total_weight"
                   FROM "activities_feedback" U0
                   WHERE U0."about_id" = "history_history"."activity_id"
                   GROUP BY U0."id"), 0)
HAVING (COUNT("history_history"."id") FILTER (WHERE ("history_history"."activity_id" IN (SELECT U0."id"
                                                                                         FROM "activities_activity" U0
                                                                                                  INNER JOIN "places_place" U1 ON (U0."place_id" = U1."id")
                                                                                                  INNER JOIN "groups_group" U2 ON (U1."group_id" = U2."id")
                                                                                                  LEFT OUTER JOIN "activities_activity_participants" U3 ON (U0."id" = U3."activity_id")
                                                                                         WHERE (U0."is_disabled" = false AND
                                                                                                lower(U0."date") < '2020-08-21T17:40:56.756315+00:00'::timestamptz AND
                                                                                                U3."user_id" IS NULL)) AND
                                                     "history_history"."typus" = 15)) > 0 OR
        COUNT("history_history"."id") FILTER (WHERE ("history_history"."id" IN (SELECT V0."id"
                                                                                FROM "history_history" V0
                                                                                WHERE (CASE
                                                                                           WHEN (V0."typus" = 15) THEN (
                                                                                               ROUND(
                                                                                                           EXTRACT(
                                                                                                                   EPOCH
                                                                                                                   FROM
                                                                                                                   (
                                                                                                                       "history_history"."payload" #>> ARRAY ['date','0']
                                                                                                                       ) :: timestamp with time zone
                                                                                                               )
                                                                                                           -
                                                                                                           EXTRACT(EPOCH FROM "history_history"."date")
                                                                                                   )
                                                                                               )
                                                                                           ELSE NULL END <= 86400 AND
                                                                                       V0."typus" = 15 AND
                                                                                       V0."activity_id" IN
                                                                                       (SELECT U0."id"
                                                                                        FROM "activities_activity" U0
                                                                                                 INNER JOIN "places_place" U1 ON (U0."place_id" = U1."id")
                                                                                                 INNER JOIN "groups_group" U2 ON (U1."group_id" = U2."id")
                                                                                                 LEFT OUTER JOIN "activities_activity_participants" U3 ON (U0."id" = U3."activity_id")
                                                                                        WHERE (U0."is_disabled" = false AND
                                                                                               lower(U0."date") < '2020-08-21T17:40:56.758086+00:00'::timestamptz AND
                                                                                               U3."user_id" IS NULL)))))) >
        0 OR COUNT("history_history"."id") FILTER (WHERE ("history_history"."typus" = 13)) > 0 OR
        COALESCE((SELECT SUM(U0."weight") AS "total_weight"
                  FROM "activities_feedback" U0
                  WHERE U0."about_id" = "history_history"."activity_id"
                  GROUP BY U0."id"), 0) > 0.0)
