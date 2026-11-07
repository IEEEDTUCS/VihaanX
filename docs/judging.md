# Judging score imports

The judging API accepts one CSV row per evaluator/team score. Assignment of
teams to panels and evaluators is managed outside this feature.

Required columns:

```csv
round_type,panel_number,evaluator_number,team_id,total_score,stars
MENTOR,panel-1,mentor-1,UABC1234,21,2
MENTOR,panel-1,mentor-2,UABC1234,24,1
```

`round_type` is either `MENTOR` or `FINAL`. The current implementation accepts
scores from `0` to `25` and stars from `0` to `3`.

Preview or import a file as an admin:

```text
POST /api/v1/admin/judging/scores/preview?roundId=mentor-round-1&roundType=MENTOR
POST /api/v1/admin/judging/scores/import?roundId=mentor-round-1&roundType=MENTOR
```

Attach the CSV using the multipart field `file`. Preview validates the file
without writing data. Import requires exactly two evaluator rows per team.

Calculate and read results:

```text
POST /api/v1/admin/judging/rounds/mentor-round-1/calculate?roundType=MENTOR
GET /api/v1/admin/judging/rounds/mentor-round-1/results?roundType=MENTOR
```

Each evaluator is normalized independently using a population standard
deviation. A team's final score is the sum of its two evaluator z-scores; total
stars are retained as the first tie-breaker.
