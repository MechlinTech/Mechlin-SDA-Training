import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/api_provider.dart';
import '../providers/auth_provider.dart';
import '../providers/analytics_provider.dart';
import '../widgets/analytics_card.dart';
import '../widgets/profile_avatar.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final analytics = context.watch<AnalyticsProvider>();
    final api = context.watch<ApiProvider>();

    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      appBar: AppBar(
        title: const Text("Day 21 Flutter API"),
        centerTitle: true,
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () async {
              await api.refresh();
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: api.refresh,
        child: SafeArea(
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                if (api.isOffline)
                  Container(
                    margin: const EdgeInsets.only(bottom: 20),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.orange.shade100,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.orange),
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.wifi_off, color: Colors.orange),
                        SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            "Offline Mode - Showing Cached Data",
                            style: TextStyle(fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ),
                  ),

                Card(
                  elevation: 6,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      children: [
                        auth.isLoggedIn
                            ? const ProfileAvatar()
                            : CircleAvatar(
                                radius: 42,
                                backgroundColor: Colors.blue.shade100,
                                child: const Icon(
                                  Icons.person_outline,
                                  size: 45,
                                  color: Colors.blue,
                                ),
                              ),
                        const SizedBox(height: 18),
                        Text(
                          auth.isLoggedIn
                              ? "Welcome, ${auth.user!.name}"
                              : "Welcome",
                          style: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          auth.isLoggedIn
                              ? "You are successfully logged in."
                              : "Please login to continue.",
                          style: TextStyle(
                            color: Colors.grey.shade600,
                            fontSize: 15,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 18),
                        Chip(
                          avatar: Icon(
                            api.isOffline ? Icons.wifi_off : Icons.wifi,
                            color: Colors.white,
                            size: 18,
                          ),
                          backgroundColor: api.isOffline
                              ? Colors.red
                              : Colors.green,
                          label: Text(
                            api.isOffline ? "Offline" : "Online",
                            style: const TextStyle(color: Colors.white),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 25),

                /// Login Button
                SizedBox(
                  height: 55,
                  child: ElevatedButton.icon(
                    icon: auth.isLoading
                        ? const SizedBox(
                            height: 20,
                            width: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: Colors.white,
                            ),
                          )
                        : const Icon(Icons.login),
                    label: const Text("Login", style: TextStyle(fontSize: 16)),
                    style: ElevatedButton.styleFrom(
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                    ),
                    onPressed: auth.isLoading
                        ? null
                        : () async {
                            await auth.login(
                              email: "demo@gmail.com",
                              password: "123456",
                            );
                          },
                  ),
                ),

                const SizedBox(height: 15),

                /// Load Analytics
                SizedBox(
                  height: 55,
                  child: ElevatedButton.icon(
                    icon: analytics.isLoading
                        ? const SizedBox(
                            height: 20,
                            width: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: Colors.white,
                            ),
                          )
                        : const Icon(Icons.analytics),
                    label: const Text(
                      "Load Analytics",
                      style: TextStyle(fontSize: 16),
                    ),
                    style: ElevatedButton.styleFrom(
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                    ),
                    onPressed: analytics.isLoading
                        ? null
                        : () async {
                            await analytics.loadAnalytics();
                          },
                  ),
                ),

                const SizedBox(height: 15),

                /// Fetch Users
                SizedBox(
                  height: 55,
                  child: ElevatedButton.icon(
                    icon: api.loading
                        ? const SizedBox(
                            height: 20,
                            width: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: Colors.white,
                            ),
                          )
                        : const Icon(Icons.cloud_download),
                    label: const Text(
                      "Fetch Users",
                      style: TextStyle(fontSize: 16),
                    ),
                    style: ElevatedButton.styleFrom(
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                    ),
                    onPressed: api.loading
                        ? null
                        : () async {
                            await api.fetchUsers();
                          },
                  ),
                ),

                const SizedBox(height: 15),

                /// Logout Button
                if (auth.isLoggedIn)
                  SizedBox(
                    height: 55,
                    child: ElevatedButton.icon(
                      icon: const Icon(Icons.logout),
                      label: const Text(
                        "Logout",
                        style: TextStyle(fontSize: 16),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.red,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                      ),
                      onPressed: () async {
                        analytics.clearAnalytics();
                        await auth.logout();
                      },
                    ),
                  ),

                const SizedBox(height: 30),

                /// Analytics Card
                const AnalyticsCard(),

                const SizedBox(height: 25),

                /// Users Section
                if (api.users.isNotEmpty) ...[
                  const Text(
                    "Fetched Users",
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),

                  const SizedBox(height: 12),

                  ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: api.users.length > 5 ? 5 : api.users.length,
                    itemBuilder: (context, index) {
                      final user = api.users[index];

                      return Card(
                        elevation: 2,
                        margin: const EdgeInsets.only(bottom: 10),
                        child: ListTile(
                          leading: CircleAvatar(
                            backgroundColor: Colors.blue.shade100,
                            child: Text(
                              user["name"]
                                  .toString()
                                  .substring(0, 1)
                                  .toUpperCase(),
                            ),
                          ),
                          title: Text(user["name"]),
                          subtitle: Text(user["email"]),
                          trailing: const Icon(
                            Icons.arrow_forward_ios,
                            size: 16,
                          ),
                        ),
                      );
                    },
                  ),
                ],

                if (api.loading)
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 20),
                    child: Center(child: CircularProgressIndicator()),
                  ),

                if (api.error != null) ...[
                  const SizedBox(height: 20),
                  Card(
                    color: Colors.red.shade50,
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Row(
                        children: [
                          const Icon(Icons.error_outline, color: Colors.red),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              api.error!,
                              style: const TextStyle(
                                color: Colors.red,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],

                const SizedBox(height: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
