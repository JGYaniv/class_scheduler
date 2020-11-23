FROM ruby:2.5-alpine

RUN apk update && apk add build-base \
    yarn \
    tzdata \
    nodejs \
    postgresql-dev

RUN mkdir /app
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY Gemfile Gemfile.lock ./
RUN bundle install --binstubs

LABEL maintainer="Jonathan Yaniv <jgyaniv@gmail.com>"

# Add a script to be executed every time the container starts.
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["/bin/sh"]
CMD ["/usr/bin/entrypoint.sh"]
EXPOSE 5000