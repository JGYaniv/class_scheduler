class Suspension < ApplicationRecord
    belongs_to :user, class_name: :User

    def time_out!
        self.update!({timed_out: true})
    end

    def time_in!
        self.update!({timed_out: false})
    end
end