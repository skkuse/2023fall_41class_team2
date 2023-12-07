from locust import HttpUser, task, TaskSet


class MainBehavior(TaskSet):
    wait_time = 50

    @task
    def main_task(self):
        self.client.post(
            "/api/carbon_emission_calculate",
            json={
                "req_code": 'public class HelloSKKU { public static void main(String[ ] args) { for(int i = 0; i < 10; i++){ System.out.println("Hello SKKU!"); System.err.println("Bye SKKU!");}}}'
            },
        )


class LocustUser(HttpUser):
    host = "http://0.0.0.0:8000"
    tasks = [MainBehavior]
