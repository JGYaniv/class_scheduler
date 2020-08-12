class SuspensionsController < ApplicationController
      before_action :authenticate_user!

      def create
        suspension = Suspension.new(suspension_params)
        suspension.save!
      end

      def destroy
        suspension = Suspension.find_by(user_id: params[:user_id])
        suspension.destroy if suspension.user.can_unsuspend?
      end

      def suspension_params
        params.require(:suspension).permit(:user_id)
      end

end
