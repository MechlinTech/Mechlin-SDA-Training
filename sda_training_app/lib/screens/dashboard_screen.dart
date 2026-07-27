import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

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

    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      appBar: AppBar(
        title: const Text("Day 20 Flutter"),
        centerTitle: true,
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              /// Profile Card
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
                          analytics.isOffline
                              ? Icons.wifi_off
                              : Icons.wifi,
                          color: Colors.white,
                          size: 18,
                        ),
                        backgroundColor: analytics.isOffline
                            ? Colors.red
                            : Colors.green,
                        label: Text(
                          analytics.isOffline ? "Offline" : "Online",
                          style: const TextStyle(
                            color: Colors.white,
                          ),
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
                  label: const Text(
                    "Login",
                    style: TextStyle(fontSize: 16),
                  ),
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

              /// Load Analytics Button
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
            ],
          ),
        ),
      ),
    );
  }
}