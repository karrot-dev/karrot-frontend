 curl -X POST \
    --header "Content-Type: application/json" \
    --data '{"build_parameters": {"backend_branch": "'${CIRCLE_BRANCH}'"}}' \
https://circleci.com/api/v1.1/project/github/yunity/foodsaving-e2e?circle-token=${CIRCLETOKEN}