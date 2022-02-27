import {
  Stack,
  Heading,
  Flex,
  Input,
  Button,
  Text,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Image,
} from "@chakra-ui/react";
import React from "react";

function Modal({ children, onClose, onSubmit, ...props }) {
  return (
    <Drawer placement="right" size="md" {...props}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader textAlign="center">Agrega tu regalo!</DrawerHeader>

        <DrawerBody>{children}</DrawerBody>

        <DrawerFooter width="100%" display="flex" justifyContent="space-evenly">
          <Button
            width={256}
            variant="outline"
            mr={3}
            onClick={onClose}
            colorScheme="red"
          >
            Cancelar
          </Button>
          <Button colorScheme="green" width={256} onClick={onSubmit}>
            Agregar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

const api = {
  fetch: async () => JSON.parse(localStorage.getItem("gifts") || "[]"),
  save: async (gifts) => localStorage.setItem("gifts", JSON.stringify(gifts)),
};

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const toast = useToast();
  const [gifts, setGifts] = React.useState([]);
  const [giftName, setGiftName] = React.useState("");
  const [giftCount, setGiftCount] = React.useState(0);
  const [giftImage, setGiftImage] = React.useState("");
  const [recipent, setRecipent] = React.useState("");
  const [editGift, setEditGift] = React.useState(null);
  const [giftPrice, setGiftPrice] = React.useState(0);

  React.useEffect(() => {
    api.fetch().then(setGifts);
  }, []);

  React.useEffect(() => {
    api.save(gifts);
  }, [gifts]);

  function handleAddGift() {
    if (giftName === "" || giftCount < 1) {
      toast({
        title: "Regalo Invalido.",
        description: "Revisa que no hayan campos vacios!.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } else {
      setGifts((gift) =>
        gift.concat({
          name: giftName,
          count: giftCount,
          img: giftImage,
          recipent: recipent,
          price: giftPrice,
          id: +new Date(),
        })
      );
      setGiftName("");
      setGiftCount(0);
      setGiftImage("");
      setGiftPrice("");
      setRecipent("");
      onClose();
    }
  }

  function handleRemove(id) {
    setGifts((gifts) => gifts.filter((gift) => gift.id !== id));
  }

  function handleCancelEdit() {
    setEditGift(null);
    setGiftCount(0);
    setGiftName("");
    setGiftImage("");
    setRecipent("");
    setGiftPrice("");
  }

  function handleEditGift(id) {
    setGifts((gifts) =>
      gifts.map((gift) =>
        gift.id !== id
          ? gift
          : {
              ...gift,
              name: giftName,
              count: giftCount,
              img: giftImage,
              recipent: recipent,
              price: giftPrice,
            }
      )
    );
    setGiftCount(0);
    setGiftImage("");
    setGiftName("");
    setRecipent("");
    setGiftPrice("");
    setEditGift(null);
  }

  return (
    <Stack h="100vh" backgroundColor="red.200" justify="center" align="center">
      {editGift && (
        <Stack
          justify="center"
          align="center"
          position="absolute"
          zIndex={2}
          top={0}
          left={0}
          backgroundColor="red.200"
          height="100%"
          width="100vw"
        >
          <Stack
            backgroundColor="white"
            borderRadius={12}
            h="80vh"
            w="40vw"
            padding={4}
            align="center"
          >
            <Heading>Edita tu Regalo!</Heading>
            <Flex w="100%" direction="column" flex={1}>
              <Input
                width={512}
                marginTop={4}
                placeholder={editGift.name}
                marginRight={4}
                value={giftName}
                onChange={(event) => setGiftName(event.target.value)}
              />
              <Input
                width={512}
                marginTop={4}
                marginRight={4}
                placeholder={editGift.img}
                value={giftImage}
                onChange={(event) => setGiftImage(event.target.value)}
              />
              <Input
                width={512}
                marginTop={4}
                marginRight={4}
                placeholder={editGift.recipent}
                value={recipent}
                onChange={(event) => setRecipent(event.target.value)}
              />
              <NumberInput
                width={512}
                marginTop={4}
                marginRight={4}
                placeholder={editGift.count}
                value={giftCount}
                onChange={(valueString) => setGiftCount(Number(valueString))}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <NumberInput
                width={512}
                marginTop={4}
                marginRight={4}
                placeholder={editGift.price}
                value={giftPrice}
                onChange={(valueString) => setGiftPrice(Number(valueString))}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Flex>
            <Flex width="100%" justify="space-evenly">
              <Button w={242} colorScheme="red" onClick={handleCancelEdit}>
                Cancelar
              </Button>
              <Button
                w={242}
                colorScheme="blue"
                onClick={() => {
                  handleEditGift(editGift.id);
                }}
              >
                Editar Regalo
              </Button>
            </Flex>
          </Stack>
        </Stack>
      )}
      <Stack
        backgroundColor="white"
        borderRadius={12}
        h="80vh"
        w="40vw"
        padding={4}
        align="center"
      >
        <Heading marginBottom={4}>Regalencys</Heading>

        <Flex width="100%">
          <Button colorScheme="blue" width="100%" ref={btnRef} onClick={onOpen}>
            Agregar Regalo
          </Button>
        </Flex>

        <Flex direction="column" w="100%" flex={1}>
          {gifts.length < 1 && (
            <Flex w="100%" justify="center" align="center" flex={1}>
              <Text fontSize={42} letterSpacing={4}>
                Regala algo raton!
              </Text>
            </Flex>
          )}
          {gifts.map((gift) => {
            return (
              <Flex key={gift.id}>
                <Flex align="center">
                  <Image width={24} height={24} src={`${gift.img}`} />
                </Flex>
                <Flex
                  flex={1}
                  w="100%"
                  justifyContent="space-between"
                  marginY={2}
                  align="flex-start"
                  direction="column"
                >
                  <Text display="flex" flex={1} marginLeft={4}>
                    {`${gift.name}(${gift.count})`}
                  </Text>
                  <Text display="flex" flex={1} marginLeft={4}>
                    {gift.recipent}
                  </Text>
                  <Text display="flex" flex={1} marginLeft={4}>
                    ${` ${gift.price * gift.count}`}
                  </Text>
                </Flex>
                <Flex align="center">
                  <Button
                    marginRight={4}
                    colorScheme="green"
                    onClick={() => {
                      setEditGift(gift);
                      setGiftName(gift.name);
                      setGiftCount(gift.count);
                      setGiftImage(gift.img);
                      setRecipent(gift.recipent);
                      setGiftPrice(gift.price);
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={() => handleRemove(gift.id)}
                  >
                    -
                  </Button>
                </Flex>
              </Flex>
            );
          })}
        </Flex>
        <Flex width="100%" direction="column" align="center">
          <Text marginBottom={4} fontSize={24}>
            Total:{" $ "}
            {gifts.reduce(
              (prev, current) => prev + current.price * current.count,
              0
            )}
          </Text>
          <Button colorScheme="red" width="100%" onClick={() => setGifts([])}>
            Borrar Todo
          </Button>
        </Flex>
      </Stack>
      <Modal
        size="full"
        isOpen={isOpen}
        onClose={onClose}
        finalFocusRef={btnRef}
        onSubmit={handleAddGift}
      >
        <Flex w="100%" flexDirection="column" align="center">
          <Input
            width={512}
            marginTop={4}
            placeholder="Agregar regalo.."
            marginRight={4}
            value={giftName}
            onChange={(event) => setGiftName(event.target.value)}
          />
          <Input
            width={512}
            marginTop={4}
            marginRight={4}
            placeholder="URL Imagen"
            value={giftImage}
            onChange={(event) => setGiftImage(event.target.value)}
          />
          <Input
            width={512}
            marginTop={4}
            marginRight={4}
            placeholder="Destinatario.."
            value={recipent}
            onChange={(event) => setRecipent(event.target.value)}
          />
          <NumberInput
            width={512}
            marginTop={4}
            marginRight={4}
            value={giftCount}
            onChange={(valueString) => setGiftCount(Number(valueString))}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <NumberInput
            width={512}
            marginTop={4}
            marginRight={4}
            value={giftPrice}
            onChange={(valueString) => setGiftPrice(Number(valueString))}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Flex>
      </Modal>
    </Stack>
  );
}

export default App;
