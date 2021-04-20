import mqtt_helper
import tkinter
from tkinter import ttk

# MQTT on_message callback (use via a lambda function below)
def example_mqtt_callback(type_name, payload, chat_window):
    print("Received message type: ", type_name)
    print("Received message payload: ", payload)
    chat_window["text"] += "\nFrom MQTT: " + payload

# Tkinter callbacks
def send_message(mqtt_client, chat_window, msg_entry):
    msg = msg_entry.get()
    msg_entry.delete(0, 'end')
    chat_window["text"] += "\nMe: " + msg
    mqtt_client.send_message("chat", msg) # Sending MQTT message

def quit_program(mqtt_client):
    mqtt_client.close()
    exit()

root = tkinter.Tk()
root.title = "MQTT PyChat"

main_frame = ttk.Frame(root, padding=20, relief='raised')
main_frame.grid()

label = ttk.Label(main_frame, justify=tkinter.LEFT, text="Send a message")
label.grid(columnspan=2)

msg_entry = ttk.Entry(main_frame, width=60)
msg_entry.grid(row=2, column=0)

msg_button = ttk.Button(main_frame, text="Send")
msg_button.grid(row=2, column=1)
msg_button['command'] = lambda: send_message(mqtt_client, chat_window, msg_entry)
root.bind('<Return>', lambda event: send_message(mqtt_client, chat_window, msg_entry))

chat_window = ttk.Label(main_frame, justify=tkinter.LEFT, text="", width=60, wraplength="500p")
# chat_window.pack(fill="x")
chat_window.grid(columnspan=2)

q_button = ttk.Button(main_frame, text="Quit")
q_button.grid(row=4, column=1)
q_button['command'] = (lambda: quit_program(mqtt_client))

mqtt_client = mqtt_helper.MqttClient() # note, use "mqtt_helper.MqttClient" in other files
mqtt_client.callback = lambda type, payload: example_mqtt_callback(type, payload, chat_window)
mqtt_client.connect("my_messages", "my_messages", use_off_campus_broker=True)  # "Send to" and "listen to" the same topic

root.mainloop()