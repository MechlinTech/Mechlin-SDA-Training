# Day 21: API Integration

## 🎯 Learning Objectives

- Master API integration in mobile applications
- Implement secure API communication with authentication
- Create real-time data synchronization
- Build offline-first mobile applications
- Implement push notifications and background sync

## 📚 Theory & Concepts

### API Integration
- **REST APIs**: Representational State Transfer
- **GraphQL**: Query language for APIs
- **WebSockets**: Real-time bidirectional communication
- **Authentication**: JWT, OAuth2, and API keys
- **Error Handling**: Robust error handling strategies

### Mobile API Patterns
- **Offline-First**: Local-first data management
- **Caching**: Intelligent data caching strategies
- **Synchronization**: Data sync between client and server
- **Background Tasks**: Background data processing
- **Push Notifications**: Real-time mobile notifications

### Best Practices
- **Security**: Secure API communication
- **Performance**: Optimized API calls
- **Error Handling**: Graceful error management
- **Testing**: API integration testing
- **Monitoring**: API performance monitoring

## 🛠️ Hands-on Tasks

### Task 1: Create API Client
Implement comprehensive API client:

```typescript
// src/services/apiClient.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;
  private isOnline: boolean = true;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
    this.setupNetworkListener();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          await this.handleUnauthorized();
        }
        return Promise.reject(error);
      }
    );
  }

  private setupNetworkListener() {
    NetInfo.addEventListener(state => {
      this.isOnline = state.isConnected ?? false;
      
      if (this.isOnline) {
        this.syncOfflineData();
      }
    });
  }

  private async handleUnauthorized() {
    await AsyncStorage.removeItem('authToken');
    // Navigate to login screen
    // This would typically use a navigation service
  }

  private async syncOfflineData() {
    // Implement offline data synchronization
    const offlineData = await AsyncStorage.getItem('offlineData');
    if (offlineData) {
      const data = JSON.parse(offlineData);
      // Sync offline data with server
      for (const item of data) {
        try {
          await this.makeRequest(item.method, item.url, item.data);
        } catch (error) {
          console.error('Failed to sync offline data:', error);
        }
      }
      await AsyncStorage.removeItem('offlineData');
    }
  }

  private async makeRequest<T>(
    method: string,
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.request({
        method: method as any,
        url,
        data,
        ...config,
      });
      return response.data;
    } catch (error) {
      if (!this.isOnline) {
        // Queue request for offline sync
        await this.queueOfflineRequest(method, url, data);
        throw new Error('Request queued for offline sync');
      }
      throw error;
    }
  }

  private async queueOfflineRequest(method: string, url: string, data: any) {
    const offlineData = await AsyncStorage.getItem('offlineData');
    const queue = offlineData ? JSON.parse(offlineData) : [];
    
    queue.push({
      method,
      url,
      data,
      timestamp: Date.now(),
    });
    
    await AsyncStorage.setItem('offlineData', JSON.stringify(queue));
  }

  // Authentication methods
  async login(credentials: { email: string; password: string }) {
    return this.makeRequest<{ user: User; token: string }>('POST', '/auth/login', credentials);
  }

  async logout() {
    return this.makeRequest('POST', '/auth/logout');
  }

  async getCurrentUser() {
    return this.makeRequest<User>('GET', '/auth/me');
  }

  // User methods
  async getUsers(filters: UserFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });

    return this.makeRequest<PaginatedResponse<User>>('GET', `/users?${params}`);
  }

  async getUser(id: string) {
    return this.makeRequest<User>('GET', `/users/${id}`);
  }

  async updateUser(id: string, data: Partial<User>) {
    return this.makeRequest<User>('PUT', `/users/${id}`, data);
  }

  // Analytics methods
  async getAnalytics(timeRange: string = '30d') {
    return this.makeRequest<AnalyticsData>('GET', `/analytics?timeRange=${timeRange}`);
  }

  // Real-time methods
  async subscribeToUpdates(callback: (data: any) => void) {
    // Implement WebSocket connection
    const ws = new WebSocket(`${this.baseURL.replace('http', 'ws')}/ws`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback(data);
    };
    
    return ws;
  }
}

export const apiClient = new ApiClient(process.env.API_BASE_URL || 'http://localhost:3000/api/v1');
```

### Task 2: Create Real-time Service
Implement WebSocket and real-time functionality:

```typescript
// src/services/realtimeService.ts
import { EventEmitter } from 'events';

interface RealtimeEvent {
  type: string;
  data: any;
  timestamp: number;
}

class RealtimeService extends EventEmitter {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnected = false;

  constructor(private baseURL: string) {
    super();
  }

  connect() {
    try {
      const wsUrl = this.baseURL.replace('http', 'ws') + '/ws';
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.emit('connected');
      };

      this.ws.onmessage = (event) => {
        try {
          const data: RealtimeEvent = JSON.parse(event.data);
          this.emit('message', data);
          this.emit(data.type, data.data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnected = false;
        this.emit('disconnected');
        this.handleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.emit('error', error);
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
      this.emit('maxReconnectAttemptsReached');
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(data: any) {
    if (this.ws && this.isConnected) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket not connected, cannot send message');
    }
  }

  subscribe(eventType: string, callback: (data: any) => void) {
    this.on(eventType, callback);
  }

  unsubscribe(eventType: string, callback: (data: any) => void) {
    this.off(eventType, callback);
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
    };
  }
}

export const realtimeService = new RealtimeService(process.env.API_BASE_URL || 'http://localhost:3000/api/v1');
```

### Task 3: Create Offline Service
Implement comprehensive offline functionality:

```typescript
// src/services/offlineService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

interface OfflineAction {
  id: string;
  method: string;
  url: string;
  data: any;
  timestamp: number;
  retries: number;
}

interface OfflineData {
  key: string;
  data: any;
  timestamp: number;
  expiresAt?: number;
}

class OfflineService {
  private static instance: OfflineService;
  private offlineQueue: OfflineAction[] = [];
  private offlineData: Map<string, OfflineData> = new Map();
  private isOnline: boolean = true;
  private syncInProgress: boolean = false;

  private constructor() {
    this.initializeNetworkListener();
    this.loadOfflineQueue();
    this.loadOfflineData();
  }

  static getInstance(): OfflineService {
    if (!OfflineService.instance) {
      OfflineService.instance = new OfflineService();
    }
    return OfflineService.instance;
  }

  private initializeNetworkListener() {
    NetInfo.addEventListener(state => {
      this.isOnline = state.isConnected ?? false;
      
      if (this.isOnline && !this.syncInProgress) {
        this.syncOfflineData();
      }
    });
  }

  private async loadOfflineQueue() {
    try {
      const queueData = await AsyncStorage.getItem('offlineQueue');
      if (queueData) {
        this.offlineQueue = JSON.parse(queueData);
      }
    } catch (error) {
      console.error('Failed to load offline queue:', error);
    }
  }

  private async saveOfflineQueue() {
    try {
      await AsyncStorage.setItem('offlineQueue', JSON.stringify(this.offlineQueue));
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  }

  private async loadOfflineData() {
    try {
      const data = await AsyncStorage.getItem('offlineData');
      if (data) {
        const parsedData = JSON.parse(data);
        this.offlineData = new Map(parsedData);
      }
    } catch (error) {
      console.error('Failed to load offline data:', error);
    }
  }

  private async saveOfflineData() {
    try {
      const data = Array.from(this.offlineData.entries());
      await AsyncStorage.setItem('offlineData', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save offline data:', error);
    }
  }

  async queueRequest(method: string, url: string, data: any) {
    const action: OfflineAction = {
      id: Date.now().toString(),
      method,
      url,
      data,
      timestamp: Date.now(),
      retries: 0,
    };

    this.offlineQueue.push(action);
    await this.saveOfflineQueue();
  }

  async storeOfflineData(key: string, data: any, expiresAt?: number) {
    const offlineData: OfflineData = {
      key,
      data,
      timestamp: Date.now(),
      expiresAt,
    };

    this.offlineData.set(key, offlineData);
    await this.saveOfflineData();
  }

  async getOfflineData(key: string): Promise<any> {
    const offlineData = this.offlineData.get(key);
    
    if (!offlineData) {
      return null;
    }

    // Check if data has expired
    if (offlineData.expiresAt && Date.now() > offlineData.expiresAt) {
      this.offlineData.delete(key);
      await this.saveOfflineData();
      return null;
    }

    return offlineData.data;
  }

  async syncOfflineData() {
    if (this.syncInProgress || !this.isOnline || this.offlineQueue.length === 0) {
      return;
    }

    this.syncInProgress = true;

    try {
      const queue = [...this.offlineQueue];
      this.offlineQueue = [];
      await this.saveOfflineQueue();

      for (const action of queue) {
        try {
          await this.syncRequest(action);
        } catch (error) {
          console.error('Failed to sync request:', error);
          
          // Re-queue failed requests with retry limit
          if (action.retries < 3) {
            action.retries++;
            this.offlineQueue.push(action);
          }
        }
      }

      await this.saveOfflineQueue();
    } finally {
      this.syncInProgress = false;
    }
  }

  private async syncRequest(action: OfflineAction) {
    // Implement actual sync logic here
    // This would typically make the API call
    console.log('Syncing offline request:', action);
  }

  getOfflineQueue(): OfflineAction[] {
    return this.offlineQueue;
  }

  getOfflineDataKeys(): string[] {
    return Array.from(this.offlineData.keys());
  }

  isConnected(): boolean {
    return this.isOnline;
  }

  async clearOfflineData() {
    this.offlineData.clear();
    this.offlineQueue = [];
    await AsyncStorage.multiRemove(['offlineQueue', 'offlineData']);
  }
}

export const offlineService = OfflineService.getInstance();
```

### Task 4: Create Push Notification Service
Implement push notifications:

```typescript
// src/services/notificationService.ts
import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';

interface NotificationData {
  title: string;
  message: string;
  data?: any;
  sound?: string;
  badge?: number;
}

class NotificationService {
  private static instance: NotificationService;
  private isInitialized: boolean = false;

  private constructor() {
    this.initialize();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private initialize() {
    if (this.isInitialized) {
      return;
    }

    PushNotification.configure({
      onRegister: (token) => {
        console.log('Push notification token:', token);
        // Send token to server
        this.sendTokenToServer(token.token);
      },
      onNotification: (notification) => {
        console.log('Push notification received:', notification);
        this.handleNotification(notification);
      },
      onAction: (notification) => {
        console.log('Push notification action:', notification);
        this.handleNotificationAction(notification);
      },
      onRegistrationError: (error) => {
        console.error('Push notification registration error:', error);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });

    this.isInitialized = true;
  }

  private async sendTokenToServer(token: string) {
    try {
      // Send token to server for push notification registration
      const response = await fetch('/api/notifications/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error('Failed to register push notification token');
      }
    } catch (error) {
      console.error('Failed to send token to server:', error);
    }
  }

  private handleNotification(notification: any) {
    // Handle notification received
    if (notification.userInteraction) {
      // User tapped on notification
      this.handleNotificationTap(notification);
    }
  }

  private handleNotificationAction(notification: any) {
    // Handle notification action
    console.log('Notification action:', notification);
  }

  private handleNotificationTap(notification: any) {
    // Handle notification tap
    console.log('Notification tapped:', notification);
  }

  async requestPermissions() {
    return new Promise((resolve, reject) => {
      PushNotification.requestPermissions({
        alert: true,
        badge: true,
        sound: true,
      }).then((permissions) => {
        resolve(permissions);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  async getToken(): Promise<string | null> {
    return new Promise((resolve) => {
      PushNotification.getToken((token) => {
        resolve(token);
      });
    });
  }

  async sendLocalNotification(notification: NotificationData) {
    PushNotification.localNotification({
      title: notification.title,
      message: notification.message,
      data: notification.data,
      sound: notification.sound || 'default',
      badge: notification.badge,
    });
  }

  async scheduleNotification(notification: NotificationData, date: Date) {
    PushNotification.localNotificationSchedule({
      title: notification.title,
      message: notification.message,
      data: notification.data,
      sound: notification.sound || 'default',
      badge: notification.badge,
      date: date,
    });
  }

  async cancelAllNotifications() {
    PushNotification.cancelAllLocalNotifications();
  }

  async getDeliveredNotifications() {
    return new Promise((resolve) => {
      PushNotification.getDeliveredNotifications((notifications) => {
        resolve(notifications);
      });
    });
  }

  async removeDeliveredNotifications(identifiers: string[]) {
    PushNotification.removeDeliveredNotifications(identifiers);
  }
}

export const notificationService = NotificationService.getInstance();
```

### Task 5: Create API Integration Hook
Implement React hook for API integration:

```typescript
// src/hooks/useApi.ts
import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/apiClient';
import { realtimeService } from '../services/realtimeService';
import { offlineService } from '../services/offlineService';

interface UseApiOptions {
  enableRealtime?: boolean;
  enableOffline?: boolean;
  cacheKey?: string;
  cacheExpiry?: number;
}

export function useApi<T>(
  endpoint: string,
  options: UseApiOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(offlineService.isConnected());

  const {
    enableRealtime = false,
    enableOffline = true,
    cacheKey,
    cacheExpiry = 5 * 60 * 1000, // 5 minutes
  } = options;

  const fetchData = useCallback(async () => {
    if (!isOnline && enableOffline) {
      // Try to get cached data
      const cachedData = await offlineService.getOfflineData(cacheKey || endpoint);
      if (cachedData) {
        setData(cachedData);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(endpoint);
      setData(response.data);

      // Cache data if offline support is enabled
      if (enableOffline && cacheKey) {
        await offlineService.storeOfflineData(cacheKey, response.data, Date.now() + cacheExpiry);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint, isOnline, enableOffline, cacheKey, cacheExpiry]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (enableRealtime) {
      const handleRealtimeUpdate = (updateData: any) => {
        setData(updateData);
      };

      realtimeService.subscribe('dataUpdate', handleRealtimeUpdate);

      return () => {
        realtimeService.unsubscribe('dataUpdate', handleRealtimeUpdate);
      };
    }
  }, [enableRealtime]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    isOnline,
  };
}
```

## 📝 Documentation Tasks

### Create API Integration Guide
Create `week3/day21/docs/api-integration-guide.md`:

```markdown
# API Integration Guide

## Mobile API Patterns
- **Offline-First**: Local-first data management
- **Caching**: Intelligent data caching strategies
- **Synchronization**: Data sync between client and server
- **Background Tasks**: Background data processing
- **Push Notifications**: Real-time mobile notifications

## Best Practices
- **Security**: Secure API communication
- **Performance**: Optimized API calls
- **Error Handling**: Graceful error management
- **Testing**: API integration testing
- **Monitoring**: API performance monitoring
```

## 🧪 Testing & Validation

### API Integration Testing
- [ ] API calls work correctly
- [ ] Authentication works
- [ ] Offline functionality works
- [ ] Real-time updates work
- [ ] Push notifications work

### Performance Testing
- [ ] API response times are acceptable
- [ ] Offline sync is efficient
- [ ] Real-time updates are responsive
- [ ] Push notifications are reliable
- [ ] Error handling is robust

## 📊 Success Criteria

By the end of Day 21, you should have:

✅ **API Integration Mastery**: Mobile API communication  
✅ **Offline Support**: Local-first data management  
✅ **Real-time Updates**: WebSocket and real-time data  
✅ **Push Notifications**: Mobile notification system  
✅ **Error Handling**: Robust error management  

## 🔄 Next Steps

1. **Commit your work**: `git add . && git commit -m "Complete Day 21: API Integration"`
2. **Create PR**: Submit pull request for code review
3. **Prepare for Day 22**: Review AI/ML fundamentals
4. **Update progress**: Document your learning in the daily summary

## 📚 Additional Resources

- [React Native Networking](https://reactnative.dev/docs/network)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Push Notifications](https://reactnative.dev/docs/push-notifications)
- [Offline Support](https://reactnative.dev/docs/offline-support)

---

**Ready for Day 22? Check out [Day 22: AI/ML Fundamentals](../day22/README.md)!** 🚀
