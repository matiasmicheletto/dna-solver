#ifndef OUTPUT_STREAM_H
#define OUTPUT_STREAM_H

#include <iostream>
#include <fstream>


enum class STREAM {CONSOLE, FILE, NONE};

class NullStream : public std::ostream {
public:
    NullStream() : std::ostream(nullptr) {}
    
    template<typename T>
    NullStream& operator<<(const T&) {
        // Do nothing with the data
        return *this;
    }
};

class OutputStream {
    public:
        OutputStream() : type(STREAM::NONE) {}
        OutputStream(std::string filename) : type(STREAM::FILE), filename(filename) {}
        OutputStream(STREAM type) : type(type) {}
        
        std::ostream* getStream() {
            if(type == STREAM::CONSOLE)
                return &std::cout;
            if(type == STREAM::FILE){
                fileStream.open(filename);
                return &fileStream;
            }
            return &nullStream;
        }
        
        ~OutputStream() {
            if(type == STREAM::FILE)
                fileStream.close();
        }

    private:
        STREAM type;
        std::string filename;
        std::ofstream fileStream;
        NullStream nullStream;
};

#endif // OUTPUT_STREAM_H