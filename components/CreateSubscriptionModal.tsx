import { icons } from "@/constants/icons";
import { posthog } from "@/src/lib/posthog";
import dayjs from "dayjs";
import { useState } from "react";
import { Modal, Text, View } from "react-native";

interface CreateSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (subscription: Subscription) => void;
}

type Frequency = "Monthly" | "Yearly";
type Category =
  | "Entertainment"
  | "AI Tools"
  | "Developer Tools"
  | "Design"
  | "Productivity"
  | "Other";
const CATEGORIES: Category[] = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Other",
];
const CATEGORY_COLORS: Record<Category, string> = {
  Entertainment: "#ff6b6b",
  "AI Tools": "#b8d4e3",
  "Developer Tools": "#e8def8",
  Design: "#f5c542",
  Productivity: "#95e1d3",
  Other: "#d4d4d4",
};

const CreateSubscriptionModal = ({
  visible,
  onClose,
  onSubmit,
}: CreateSubscriptionModalProps) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("Monthly");
  const [category, setCategory] = useState<Category>("Other");

  // ***Improved price validation
  const isValidPrice = () => {
    const trimmedPrice = price.trim();
    if (!trimmedPrice) return false;
    // ***Strict numeric pattern check
    if (!/^\s*[+-]?(\d+(\.\d+)?|\.\d+)\s*$/.test(trimmedPrice)) return false;
    const numValue = Number(trimmedPrice);
    return Number.isFinite(numValue) && numValue > 0;
  };

  const isFormValid = name.trim() !== "" && isValidPrice();

  const handleSubmit = () => {
    if (!isFormValid) return;

    const priceValue = Number(price.trim());
    const now = dayjs();
    const renewalDate =
      frequency === "Monthly" ? now.add(1, "month") : now.add(1, "year");

    const newSubscription: Subscription = {
      id: `sub-${Date.now()}`,
      name: name.trim(),
      price: priceValue,
      currency: "USD",
      frequency,
      category,
      status: "active",
      startDate: now.toISOString(),
      renewalDate: renewalDate.toISOString(),
      icon: icons.plus,
      billing: frequency,
      color: CATEGORY_COLORS[category],
    };

    onSubmit(newSubscription);

    posthog?.capture("subscription_created", {
      subscription_name: name.trim(),
      subscription_price: priceValue,
      subscription_frequency: frequency,
      subscription_category: category,
    });

    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setFrequency("Monthly");
    setCategory("Other");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal>
      <View>
        <Text>CreateSubscriptionModal</Text>
      </View>
    </Modal>
  );
};

export default CreateSubscriptionModal;
