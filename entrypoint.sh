echo this is an entrypoint
bundle exec rails db:create RAILS_ENV=development
bundle exec rails db:migrate RAILS_ENV=development
bundle exec rails db:seed
bundle exec rails assets:precompile
bundle exec puma -C ./config/puma.rb