import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/analytics_provider.dart';

class AnalyticsCard extends StatelessWidget {
  const AnalyticsCard({super.key});

  @override
  Widget build(BuildContext context) {
    final analytics = context.watch<AnalyticsProvider>();

    return Column(
      children: [
        if (analytics.error != null)
          Padding(
            padding: const EdgeInsets.only(bottom: 20),
            child: Text(
              analytics.error!,
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: Colors.red,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),

        if (analytics.analytics != null)
          Card(
            elevation: 4,
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  const Icon(
                    Icons.analytics,
                    color: Colors.blue,
                    size: 40,
                  ),

                  const SizedBox(height: 10),

                  const Text(
                    "Analytics",
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  const Divider(),

                  if (analytics.isOffline)
                    const Padding(
                      padding: EdgeInsets.only(bottom: 10),
                      child: Text(
                        "Offline Mode (Cached Data)",
                        style: TextStyle(
                          color: Colors.orange,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),

                  ListTile(
                    leading: const Icon(Icons.people),
                    title: const Text("Total Users"),
                    trailing: Text(
                      analytics.analytics!.totalUsers.toString(),
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
      ],
    );
  }
}