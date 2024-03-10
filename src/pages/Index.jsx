import React, { useState, useEffect } from "react";
import { Box, Flex, Text, Image, Heading, IconButton, useColorMode } from "@chakra-ui/react";
import { FaSun, FaMoon, FaMapMarkerAlt, FaSearchLocation } from "react-icons/fa";

const Index = () => {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherData(latitude, longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
      },
    );
  }, []);

  const fetchWeatherData = async (latitude, longitude) => {
    setIsLoading(true);
    try {
      const apiKey = "YOUR_API_KEY"; // Replace with your actual API key
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
      const data = await response.json();
      setWeather(data);
      setLocation(`${data.name}, ${data.sys.country}`);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSearch = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherData(latitude, longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
      },
    );
  };

  return (
    <Flex minH="100vh" alignItems="center" justifyContent="center" bgGradient={colorMode === "light" ? "linear(to-b, blue.300, blue.500)" : "linear(to-b, gray.700, gray.900)"}>
      <Box p={8} borderRadius="lg" boxShadow="lg" bg={colorMode === "light" ? "white" : "gray.800"} color={colorMode === "light" ? "gray.800" : "white"}>
        <Flex alignItems="center" justifyContent="space-between" mb={4}>
          <Heading size="md">Weather</Heading>
          <IconButton aria-label="Toggle color mode" icon={colorMode === "light" ? <FaMoon /> : <FaSun />} onClick={toggleColorMode} />
        </Flex>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : weather ? (
          <>
            <Flex alignItems="center" mb={4}>
              <FaMapMarkerAlt />
              <Text ml={2}>{location}</Text>
            </Flex>
            <Flex alignItems="center" mb={4}>
              <Image src={`https://openweathermap.org/img/w/${weather.weather[0].icon}.png`} alt={weather.weather[0].description} boxSize="64px" />
              <Heading size="4xl" ml={4}>
                {Math.round(weather.main.temp)}°C
              </Heading>
            </Flex>
            <Text>{weather.weather[0].description}</Text>
          </>
        ) : (
          <Text>No weather data available.</Text>
        )}
        <IconButton aria-label="Search location" icon={<FaSearchLocation />} onClick={handleLocationSearch} mt={4} />
      </Box>
    </Flex>
  );
};

export default Index;
