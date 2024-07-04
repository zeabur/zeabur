# Apache Kafka

[![Deploy with Zeabur](https://zeabur.com/button.svg)](https://zeabur.com/templates/ZBC4S7)

[Apache Kafka](https://kafka.apache.org) is an open-source distributed event streaming platform used by thousands of companies for high-performance data pipelines, streaming analytics, data integration, and mission-critical applications.

Note that for _external_ connections to the broker i.e. those from _outside_ the docker network. This could be from the host machine running docker, or maybe further afield if you've got a more complicated setup.

If the latter is true, you will need to change the value `localhost` in `KAFKA_ADVERTISED_LISTENERS` to the forwarded hostname and port, which you can see in the "Networking" tab.

For connections _internal_ to the docker network, such as from other services and components, use `kafka.zeabur.internal:29092`.
