import React from 'react';

import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    TouchableOpacity,
    Dimensions,
    Picker,
    Platform,
} from 'react-native';

import ConfettiCannon from 'react-native-confetti-cannon';

const screen = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        marginTop: 75,
        borderWidth: 10,
        borderColor: '#28d492',
        width: screen.width / 2,
        height: screen.width / 2,
        borderRadius: screen.width / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonStop: {
        marginTop: 115,
        borderColor: "#db4040",
    },
    buttonText: {
        fontSize: 45,
        color: '#28d492',
    },
    buttonTextStop: {
        color: "#db4040",
    },
    timerText: {
        marginTop: 75,
        color: '#fff',
        fontSize: 85,
    },
    picker: {
        width: 50,
        ...Platform.select({
            android: {
                color: '#fff',
                backgroundColor: '#07121B',
                marginLeft: '10',
            },
        }),
    },
    pickerItem: {
        color: "#fff",
        fontSize: 20,
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

const getRemaining = (time) => {
    const hours = Math.floor(time / 60 / 60);
    const minutes = Math.floor(time / 60 - hours * 60);
    //  const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;
    return { hours: formatNumber(hours), minutes: formatNumber(minutes), seconds: formatNumber(seconds) };
};

const createArray = length => {
    const arr = [];
    let i = 0;
    while (i < length) {
        arr.push(i.toString());
        i += 1;
    }
    return arr;
};

const AVAILABLE_HOURS = createArray(3);
const AVAILABLE_MINUTES = createArray(60);
const AVAILABLE_SECONDS = createArray(60);

//3 => 03   10 => 10
const formatNumber = (number) => `0${number}`.slice(-2)


export default class App extends React.Component {
    state = {
        remainingSeconds: 5,
        isRunning: false,
        selectedHours: '0',
        selectedMinutes: '0',
        selectedSeconds: '5',
    };

    interval = null;

    componentDidUpdate(prevProp, prevState) {
        if (prevState.remainingSeconds === 1) {
            this.explosion && this.explosion.start();
        }
        if (this.state.remainingSeconds === -1 && prevState.remainingSeconds !== -1) {
            this.stop();
        }
    }

    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    start = () => {
        this.setState(state => ({
            remainingSeconds:
                parseInt(state.selectedHours, 10) * 60 * 60 +
                parseInt(state.selectedMinutes, 10) * 60 +
                parseInt(state.selectedSeconds, 10),
            isRunning: true,
        }));

        this.interval = setInterval(() => {
            this.setState(state => ({
                remainingSeconds: state.remainingSeconds - 1
            }));
        }, 1000);
    }

    stop = () => {
        clearInterval(this.interval);
        this.interval = null;
        this.setState({
            remainingSeconds: 5, //temporary,
            isRunning: false,
        });
    };

    renderPickers = () => (
        < View style={styles.pickerContainer}>
            <Picker
                style={styles.picker}
                itemStyle={styles.pickerItem}
                selectedValue={this.state.selectedHours}
                onValueChange={itemValue => {
                    //update the state
                    this.setState({ selectedHours: itemValue });
                }}
                mode="dropdown"
            >
                {AVAILABLE_HOURS.map(value => (
                    <Picker.Item key={value} label={value} value={value} />
                ))}
            </Picker >
            <Text style={styles.pickerItem}>hours</Text>
            <Picker
                style={styles.picker}
                itemStyle={styles.pickerItem}
                selectedValue={this.state.selectedMinutes}
                onValueChange={itemValue => {
                    //update the state
                    this.setState({ selectedMinutes: itemValue });
                }}
                mode="dropdown"
            >
                {AVAILABLE_MINUTES.map(value => (
                    <Picker.Item key={value} label={value} value={value} />
                ))}
            </Picker >
            <Text style={styles.pickerItem}>minutes</Text>
            <Picker
                style={styles.picker}
                itemStyle={styles.pickerItem}
                selectedValue={this.state.selectedSeconds}
                onValueChange={itemValue => {
                    //update the state
                    this.setState({ selectedSeconds: itemValue });
                }}
                mode="dropdown"
            >
                {AVAILABLE_SECONDS.map(value => (
                    <Picker.Item key={value} label={value} value={value} />
                ))}
            </Picker>
            <Text style={styles.pickerItem}>seconds</Text>
        </View >
    );

    render() {
        const { hours, minutes, seconds } = getRemaining(this.state.remainingSeconds);

        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" />

                <ConfettiCannon
                    count={200}
                    origin={{ x: -16, y: 0 }}
                    autoStart={false}
                    fadeOut={true}
                    ref={ref => (this.explosion = ref)}
                />

                {this.state.isRunning ? (
                    <Text style={styles.timerText}>{`${hours}:${minutes}:${seconds}`}</Text>
                ) : (
                        this.renderPickers()
                    )}
                {this.state.isRunning ? (
                    <TouchableOpacity
                        onPress={this.stop}
                        style={[styles.button, styles.buttonStop]}
                    >
                        <Text style={[styles.buttonText, styles.buttonTextStop]}>Stop</Text>
                    </TouchableOpacity>
                ) : (
                        <TouchableOpacity
                            onPress={this.start}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Start</Text>
                        </TouchableOpacity>
                    )}
            </View>
        );
    }
}