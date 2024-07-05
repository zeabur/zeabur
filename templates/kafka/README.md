# Apache Kafka

[![Deploy with Zeabur](https://zeabur.com/button.svg)](https://zeabur.com/templates/ZBC4S7)

[Apache Kafka](https://kafka.apache.org) is an open-source distributed event streaming platform used by thousands of companies for high-performance data pipelines, streaming analytics, data integration, and mission-critical applications.

Note that for _external_ connections to the broker, i.e., those from outside the Zeabur private networking, you may need to adjust the configuration. This could be from your local machine or a more complicated setup. If the latter is true, you will need to change the value `localhost` in `KAFKA_ADVERTISED_LISTENERS` to the forwarded hostname and port, which you can find in the "Networking" tab. For _internal_ connections between services within the project, please use `kafka.zeabur.internal:29092`.
