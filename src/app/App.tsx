"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { RAPID_API_KEY, RAPID_API_HOST, RAPID_API_URL } from "@/lib/constants";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";
import { CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import Loader from "@/components/Loader";
import { useToast } from "@/components/ui/use-toast";

/** Primary Component */
export default function Home() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fLang, setFLang] = useState("");
  const [sLang, setSLang] = useState("");
  const [open1, setOpen1] = useState(false);
  const { toast } = useToast();
  const defaultValues = {
    fLanguagee: "",
    inputTextt: "",
    sLanguagee: "",
    cTextt: "",
  };
  const form = useForm({ defaultValues });

  const options = {
    method: "GET",
    url: `${RAPID_API_URL}/getLanguages`,
    headers: {
      "X-RapidAPI-Key": RAPID_API_KEY,
      "X-RapidAPI-Host": RAPID_API_HOST,
    },
  };

  const encodedParams = new URLSearchParams();

  const options1 = {
    method: "POST",
    url: `${RAPID_API_URL}/translate`,
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "X-RapidAPI-Key": RAPID_API_KEY,
      "X-RapidAPI-Host": RAPID_API_HOST,
    },
    data: encodedParams,
  };

  const translate = async () => {
    try {
      setLoading(true);
      const response = await axios.request(options1);
      console.log(response.data);
      form.setValue("cTextt", response.data.data.translatedText);
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.Message || "Network error. Please try again",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.request(options);
        console.log(response.data);
        setData(response.data.data.languages);
      } catch (error: any) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error.message || "Network error. Please try again",
          duration: 4000,
        });
      }
    };
    fetchData();
  }, []);

  type formProps = {
    fLanguagee: string;
    sLanguagee: string;
    inputTextt: string;
  };

  const handleSubmit = ({ fLanguagee, sLanguagee, inputTextt }: formProps) => {
    if (!fLanguagee || !sLanguagee || !inputTextt) {
      console.error("Invalid parameters");
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Fill all inputs correctly",
        duration: 4000,
      });
      return;
    }
    encodedParams.set("source_language", fLang);
    encodedParams.set("target_language", sLang);
    encodedParams.set("text", inputTextt);
    translate();
  };
  type lang = {
    name: string;
    code: string;
  };
  return (
    <Form {...form}>
      <Toaster />
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="m-8 space-y-4"
      >
        <FormField
          control={form.control}
          name="fLanguagee"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>First Language</FormLabel>{" "}
              <FormControl>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-[200px] justify-between border-black"
                    >
                      {field.value
                        ? (data as lang[]).find((lang: lang) => {
                            return lang.name === field.value;
                          })?.name
                        : "Select language..."}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search language..."
                        className="h-9"
                      />
                      <CommandEmpty>No language found.</CommandEmpty>
                      <ScrollArea className="h-[250px]">
                        <CommandGroup>
                          {(data as lang[]).map((lang: lang) => (
                            <CommandItem
                              key={lang.code}
                              value={lang.name}
                              onSelect={() => {
                                form.setValue("fLanguagee", lang.name);
                                setFLang(lang.code);
                                setOpen(false);
                              }}
                            >
                              {lang.name}
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  field.value === lang.name
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </ScrollArea>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="inputTextt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Input Text</FormLabel>
              <FormControl>
                <Input
                  placeholder="enter the text to be converted"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sLanguagee"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>To Language</FormLabel>
              <FormControl>
                <Popover open={open1} onOpenChange={setOpen1}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-[200px] justify-between border-black"
                    >
                      {field.value
                        ? (data as lang[]).find((lang: lang) => {
                            return lang.name === field.value;
                          })?.name
                        : "Select language..."}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search language..."
                        className="h-9"
                      />
                      <CommandEmpty>No language found.</CommandEmpty>
                      <ScrollArea className="h-[250px]">
                        <CommandGroup>
                          {data.map((lang: lang) => (
                            <CommandItem
                              key={lang.code}
                              value={lang.name}
                              onSelect={() => {
                                form.setValue("sLanguagee", lang.name);
                                setSLang(lang.code);
                                setOpen1(false);
                              }}
                            >
                              {lang.name}
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  field.value === lang.name
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </ScrollArea>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button>{loading ? <Loader /> : "Submit"}</Button>
        <FormField
          control={form.control}
          name="cTextt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>converted Text</FormLabel>
              <FormControl>
                <Input
                  placeholder="converted text will appear hear"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
