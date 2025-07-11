<div class="container mx-auto px-4 py-8">
	<div class="max-w-4xl mx-auto">
		<h1 class="text-3xl font-bold text-gray-800 mb-6">Settings</h1>
		
		<div class="bg-white rounded-lg shadow-md p-8">
			<div class="space-y-8">
				<!-- Theme Settings -->
				<div>
					<h3 class="text-lg font-semibold text-gray-700 mb-4">Appearance</h3>
					<div class="space-y-4">
						<div class="flex items-center justify-between">
							<span class="text-gray-600">Theme</span>
							<select class="border border-gray-300 rounded-md px-3 py-2">
								<option>Light</option>
								<option>Dark</option>
								<option>System</option>
							</select>
						</div>
						<div class="flex items-center justify-between">
							<span class="text-gray-600">Font Size</span>
							<select class="border border-gray-300 rounded-md px-3 py-2">
								<option>Small</option>
								<option>Medium</option>
								<option>Large</option>
								<option>Extra Large</option>
							</select>
						</div>
					</div>
				</div>

				<!-- Reading Settings -->
				<div>
					<h3 class="text-lg font-semibold text-gray-700 mb-4">Reading Preferences</h3>
					<div class="space-y-4">
						<div class="flex items-center justify-between">
							<span class="text-gray-600">Translation Language</span>
							<select class="border border-gray-300 rounded-md px-3 py-2">
								<option>English</option>
								<option>Indonesian</option>
								<option>Arabic</option>
								<option>Urdu</option>
							</select>
						</div>
						<div class="flex items-center justify-between">
							<span class="text-gray-600">Show Arabic Text</span>
							<input type="checkbox" checked class="w-4 h-4 text-emerald-600">
						</div>
						<div class="flex items-center justify-between">
							<span class="text-gray-600">Show Translation</span>
							<input type="checkbox" checked class="w-4 h-4 text-emerald-600">
						</div>
					</div>
				</div>

				<!-- Location Settings -->
				<div>
					<h3 class="text-lg font-semibold text-gray-700 mb-4">Location</h3>
					<div class="space-y-4">
						<div class="flex items-center justify-between">
							<span class="text-gray-600">City</span>
							<input type="text" value="Jakarta" class="border border-gray-300 rounded-md px-3 py-2">
						</div>
						<div class="flex items-center justify-between">
							<span class="text-gray-600">Prayer Time Calculation Method</span>
							<select class="border border-gray-300 rounded-md px-3 py-2">
								<option>Muslim World League</option>
								<option>Islamic Society of North America</option>
								<option>Egyptian General Authority</option>
								<option>Umm Al-Qura University</option>
							</select>
						</div>
					</div>
				</div>

				<!-- Notification Settings -->
				<div>
					<h3 class="text-lg font-semibold text-gray-700 mb-4">Notifications</h3>
					<div class="space-y-4">
						<div class="flex items-center justify-between">
							<span class="text-gray-600">Prayer Time Notifications</span>
							<input type="checkbox" checked class="w-4 h-4 text-emerald-600">
						</div>
						<div class="flex items-center justify-between">
							<span class="text-gray-600">Daily Verse Reminder</span>
							<input type="checkbox" class="w-4 h-4 text-emerald-600">
						</div>
					</div>
				</div>
			</div>

			<div class="mt-8 pt-6 border-t border-gray-200">
				<button class="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
					Save Settings
				</button>
			</div>
		</div>
	</div>
</div>
