# Performance Testing OpenCart Website
## Table of Content
- [Introduction](https://https://github.com/asaha12/Performance-Testing-Project-Evaly#introduction)
- [Install](https://https://github.com/asaha12/Performance-Testing-Project-Evaly#install)
- [Prerequisites](https://https://github.com/asaha12/Performance-Testing-Project-Evaly#Prerequisites)
- [Elements of a minimal test plan](https://https://github.com/asaha12/Performance-Testing-Project-Evaly#Elements-of-a-minimal-test-plan)
- [Test Plan](https://https://github.com/asaha12/Performance-Testing-Project-Evaly#Test-Plan)
- [Load Testing Report](https://https://github.com/asaha12/Performance-Testing-Project-Evaly#Load-Testing-Report)
- [Summary Load Testing](https://https://github.com/asaha12/Performance-Testing-Project-Evaly#Summary-Load-Testing)
- [Conclusion](https://https://github.com/asaha12/Performance-Testing-Project-Evaly#Conclusion)
## Introduction
- This report provides an overview of the load testing, stress testing, and spike testing conducted on the evaly.com.bd website. The objective of this testing was to evaluate the system's performance under various load conditions and ensure it meets the specified requirements.
## Install
- **Java**  
https://www.oracle.com/java/technologies/downloads/

- **JMeter**  
https://jmeter.apache.org/download_jmeter.cgi     
- =>**apache-jmeter-5.5.zip**

- **We use BlazeMeter to generate JMX files**    
https://chrome.google.com/webstore/detail/blazemeter-the-continuous/mbopgmdnpcbohhpnfglgohlbhfongabi?hl=en

## Prerequisites
- As of JMeter 4.0, Java 8 and above are supported.
- we suggest  multicore CPUs with 4 or more cores.
- Memory 16GB RAM is a good value.

## Elements of a minimal test plan
- Thread Group

    The root element of every test plan. Simulates the (concurrent) users and then runs all requests. Each thread simulates a single user.

- HTTP Request Default (Configuration Element)

- HTTP Request (Sampler)

- Summary Report (Listener)

## Test Plan

Testplan > Add > Threads (Users) > Thread Group (this might vary depending on the JMeter version you are using)
- Name: Evaly
- Number of Threads (users): 20
- Ramp-Up Period (in seconds): 10
- Loop Count: 1  

  1) The general setting for the tests execution, such as whether Thread Groups will run simultaneously or sequentially, is specified in the item called Test Plan.

  2) All HTTP Requests will use some default settings from the HTTP Request, such as the Server IP, Port Number, and Content-Encoding.

  3) Each Thread Group specifies how the HTTP Requests should be carried out. To determine how many concurrent "users" will be simulated, one must first know the number of threads. The number of actions each "user" will perform is determined by the loop count.

  4) The HTTP Header Manager, which allows you to provide the Request Headers that will be utilized by the upcoming HTTP Requests, is the first item in Thread Groups.
 ## Collection of API

- Run BlazeMeter  
- Collect Frequently used API  
- Save the JMX file then paste => **apache-jmeter-5.5\bin**

    

![image](https://github.com/asaha12/cricket_19_keyboard/assets/113898640/58500aa3-912b-4216-b0cd-ed6d981f278b)

## Load Testing Report

![image](https://github.com/asaha12/cricket_19_keyboard/assets/113898640/d4051a3b-e122-4b44-a312-21203d42eef9)

**Number of Threads 20; Ramp-Up Period 10s**
 |  Errors 20 Threads
:-------------------------:
![a](https://github.com/asaha12/cricket_19_keyboard/assets/113898640/464fe39f-4931-4b46-a934-167391b534ea)

Errors 
:-------------------------:
![a](https://github.com/asaha12/cricket_19_keyboard/assets/113898640/944a54b0-5816-4935-8582-31160bdb7384) 



## Summary Load Testing
- While executing concurrent requests, 31 errors of 429/Too Many Requests and the error rate is 1.07%.
- Server can handle almost concurrent all API calls with almost zero (0) error rate.



## Conclusion
The performance testing conducted on the Opencart website provided valuable insights into the system's behavior and performance under various conditions. Here is a summary of the overall performance testing outcome and the insights gained:

### Summary of Performance Testing Outcome:
- The application demonstrated good performance under normal and expected load conditions.
- Response times were generally within acceptable ranges, meeting user expectations.
- Throughput was satisfactory, handling the expected transaction volume effectively.
- Error rates were low, indicating good application stability and robustness.
### Insights and Observations:
- Scalability Potential: The application exhibited potential for scalability, showing the ability to handle increased load without a significant degradation in performance.

- Database Optimization Opportunities: Analysis revealed areas for optimizing database queries and improving indexing strategies to enhance response times, especially as the user base grows.

- Caching Improvements: Implementing a robust caching mechanism could further optimize response times and reduce the load on the application server.

- Content Delivery Optimization: Leveraging a Content Delivery Network (CDN) for static assets can significantly improve load times for users across different geographic locations.

- Resource Utilization: Monitoring resource utilization during tests highlighted areas where resource allocation could be optimized for better efficiency.

### Recommendations for Improvement:
- Implement a caching strategy to reduce database load and improve response times.
- Conduct a comprehensive database performance tuning exercise to optimize queries and indexing.
- Explore CDN integration to enhance content delivery and reduce latency for users.
- Continuously monitor and optimize resource utilization for optimal system performance.
- The insights gained from this performance testing will serve as a roadmap for optimizing the application's performance, ensuring a seamless and responsive user experience even during peak load times.

