import { View, Text } from 'react-native'
import { Link } from 'expo-router'

const SignUp = () => {
  return (
    <View>
      <Text>SignUp</Text>
      <Link href="/(auth)/sign-up">Sign In</Link>
      <Link href="/(tabs)" className="mt-4 rounded bg-primary text-white p-4">Go to Home</Link>
    </View>
  )
}

export default SignUp