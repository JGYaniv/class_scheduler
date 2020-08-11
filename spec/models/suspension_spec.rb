require 'rails_helper'

RSpec.describe Suspension, type: :model do
    
    before(:example) do
        @user = User.create!({
            first_name: "Ben", last_name: "Franklin", terms_and_conditions: 2, password: 'password', password_confirmation: 'password',
            address: "100 1st Avenue", city: "New York", timezone: "Eastern Time (US & Canada)",
            state: "Ny", country: "usa", active: true, generated_password: false, locale: "en", 
            email_notification: true, email: "ben@domain.com"
        })
    end

    it { is_expected.to belong_to(:user) }
    it { is_expected.to have_db_column(:user_id).of_type(:integer) }
    it { is_expected.to have_db_column(:timed_out).of_type(:boolean) }
    it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }

    it 'should set timed_out to true when Suspension#time_out!' do
        test_suspension = Suspension.create({user_id: @user.id})
        test_suspension.time_out!()
        expect(test_suspension.timed_out).to eq(true)
    end

    it 'should set timed_out to true when Suspension#time_in!' do
        test_suspension = Suspension.create({user_id: @user.id, timed_out: true})
        test_suspension.time_in!()
        expect(test_suspension.timed_out).to eq(false)
    end
end