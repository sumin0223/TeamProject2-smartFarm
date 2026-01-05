import json
import time
import paho.mqtt.client as mqtt
import RPi.GPIO as GPIO

class Blind:
    def __init__(self,pin):
        # ===== GPIO 설정 =====
        SERVO_PIN = pin
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(SERVO_PIN, GPIO.OUT)

        self.pwm = GPIO.PWM(SERVO_PIN, 50)  # 50Hz
        self.pwm.start(0)

    def set_angle(self,angle):
        duty = 2 + (angle / 18)
        self.pwm.ChangeDutyCycle(duty)
        time.sleep(0.5)
        self.pwm.ChangeDutyCycle(0)
        

    # ===== MQTT 콜백 =====
    def on_connect(client, userdata, flags, rc):
        print("MQTT Connected")
        client.subscribe("home/actuator/blind")

    def on_message(self, msg):
        print("받은 메시지:", msg)
        action = msg.get("action", "")
        if action == "OPEN":
            angle = 90  # 블라인드 열기
        elif action == "CLOSE":
            angle = 0  # 블라인드 닫기
        print(f"블라인드 각도 설정: {angle}도")
        self.set_angle(angle)

# ===== MQTT 연결 =====
# client = mqtt.Client()
# client.on_connect = on_connect
# client.on_message = on_message

# client.connect("192.168.14.12", 1883, 60)
# client.loop_forever()
if __name__ == "__main__":
    blind = Blind(16)  # 서보모터 (블라인드)                                                                                                                                                                                
    try:
        while True:
            blind.set_angle(90)  # 블라인드 열기
            time.sleep(5)
            blind.set_angle(0)   # 블라인드 닫기
            time.sleep(5)
    except KeyboardInterrupt:
        pass