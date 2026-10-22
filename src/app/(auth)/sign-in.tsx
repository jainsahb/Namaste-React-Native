import { View, Text } from 'react-native'
import { Link } from 'expo-router'

const SignIn = () => {
  return (
    <View>
      <Text>SignIn</Text>
      <Link href="/(auth)/sign-up">Create Account</Link>
      <Link href="/(tabs)" className="mt-4 rounded bg-primary text-white p-4">Go to Home</Link>
    </View>
  )
}

export default SignIn