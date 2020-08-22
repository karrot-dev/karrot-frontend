SELECT "places_place"."id",
       "places_place"."created_at",
       "places_place"."address",
       "places_place"."latitude",
       "places_place"."longitude",
       "places_place"."group_id",
       "places_place"."name",
       "places_place"."description",
       "places_place"."weeks_in_advance",
       "places_place"."status",
       "places_place"."last_changed_by_id",
       COUNT("history_history"."id") FILTER (WHERE ("history_history"."typus" = 13 AND
                                                    "history_history_users"."user_id" IN (1)))              AS "activity_done_count",
       COUNT("history_history"."id") FILTER (WHERE ("history_history"."activity_id" IN (SELECT U0."id"
                                                                                        FROM "activities_activity" U0
                                                                                                 INNER JOIN "places_place" U1 ON (U0."place_id" = U1."id")
                                                                                                 INNER JOIN "groups_group" U2 ON (U1."group_id" = U2."id")
                                                                                                 LEFT OUTER JOIN "activities_activity_participants" U3 ON (U0."id" = U3."activity_id")
                                                                                        WHERE (U0."is_disabled" = False AND lower(U0."date") < '2020-08-21 17:11:30.945242+00:00' AND U3."user_id" IS NULL)) AND
                                                    "history_history"."typus" = 15 AND
                                                    "history_history_users"."user_id" IN (1)))              AS "activity_leave_count",
       COUNT("history_history"."id") FILTER (WHERE "history_history"."id" IN (SELECT V0."id"
                                                                              FROM "history_history" V0
                                                                                       INNER JOIN "history_history_users" V2 ON (V0."id" = V2."history_id")
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
                                                                                                          WHERE (U0."is_disabled" = False AND lower(U0."date") < '2020-08-21 17:11:30.945242+00:00' AND U3."user_id" IS NULL)) AND
                                                                                     V2."user_id" IN (1)))) AS "activity_leave_late_count",
       COALESCE((SELECT SUM(U0."weight") AS "total_weight"
                 FROM "activities_feedback" U0
                 WHERE (U0."about_id" = "history_history"."activity_id" AND U0."given_by_id" = 1)
                 GROUP BY U0."id"),
                0)                                                                                          AS "activity_feedback_weight"
FROM "places_place"
         INNER JOIN "groups_group" ON ("places_place"."group_id" = "groups_group"."id")
         LEFT OUTER JOIN "history_history" ON ("places_place"."id" = "history_history"."place_id")
         LEFT OUTER JOIN "activities_activity" ON ("history_history"."activity_id" = "activities_activity"."id")
         INNER JOIN "groups_group_members" ON ("groups_group"."id" = "groups_group_members"."group_id")
         LEFT OUTER JOIN "history_history_users" ON ("history_history"."id" = "history_history_users"."history_id")
WHERE ("places_place"."group_id" = 1 AND
       lower("activities_activity"."date") <= '2020-08-21 17:11:30.945242+00:00' AND "groups_group_members"."user_id" = 18)
GROUP BY "places_place"."id",
         COALESCE((SELECT SUM(U0."weight") AS "total_weight"
                   FROM "activities_feedback" U0
                   WHERE (U0."about_id" = "history_history"."activity_id" AND U0."given_by_id" = 1)
                   GROUP BY U0."id"), 0)
HAVING (COUNT("history_history"."id") FILTER (WHERE ("history_history"."activity_id" IN (SELECT U0."id"
                                                                                         FROM "activities_activity" U0
                                                                                                  INNER JOIN "places_place" U1 ON (U0."place_id" = U1."id")
                                                                                                  INNER JOIN "groups_group" U2 ON (U1."group_id" = U2."id")
                                                                                                  LEFT OUTER JOIN "activities_activity_participants" U3 ON (U0."id" = U3."activity_id")
                                                                                         WHERE (U0."is_disabled" = False AND lower(U0."date") < '2020-08-21 17:11:30.945242+00:00' AND U3."user_id" IS NULL)) AND
                                                     "history_history"."typus" = 15 AND
                                                     "history_history_users"."user_id" IN (1))) > 0 OR
        COUNT("history_history"."id") FILTER (WHERE ("history_history"."id" IN (SELECT V0."id"
                                                                                FROM "history_history" V0
                                                                                         INNER JOIN "history_history_users" V2 ON (V0."id" = V2."history_id")
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
                                                                                        WHERE (U0."is_disabled" = False AND lower(U0."date") < '2020-08-21 17:11:30.945242+00:00' AND U3."user_id" IS NULL)) AND
                                                                                       V2."user_id" IN (1))))) > 0 OR
        COUNT("history_history"."id")
        FILTER (WHERE ("history_history"."typus" = 13 AND "history_history_users"."user_id" IN (1))) > 0 OR
        COALESCE((SELECT SUM(U0."weight") AS "total_weight"
                  FROM "activities_feedback" U0
                  WHERE (U0."about_id" = "history_history"."activity_id" AND U0."given_by_id" = 1)
                  GROUP BY U0."id"), 0) > 0.0)
