class CreateSuspensions < ActiveRecord::Migration[5.2]
  def change
    create_table :suspensions do |t|
      t.integer :user_id, null:false
      t.boolean :timed_out, default: false

      t.timestamps
    end

    add_index :suspensions, :user_id, unique: true
  end
end
